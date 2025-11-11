import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth.service';
import * as CryptoJS from 'crypto-js';
import WordArray from 'crypto-js/lib-typedarrays';
import { License } from '@app/core/models/interfaces/license';
type Padding = typeof CryptoJS.pad.NoPadding;

@Component({
  selector: 'app-video-player',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

//TODO: Create DecryptionService and VideoManagementService and move relevant logic there...
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @Input() isLicenseValid = false;

  _license?: License;

  @Input() set license(license: License) {
    if (license) {
      this._license = license;
    }
    console.log(this._license);
  }

  @Input() source?: string;
  readonly #authService = inject(AuthService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;

  @Input() set movieLink(source: string) {
    this.source = source;
  }

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    if (this.source) {
      await this.initializeVideo();
    }
  }

  async initializeVideo() {
    console.log('Initializing video...');
    if (!this.source) return;

    const video = this.videoElement.nativeElement;
    if (!video) return;

    console.log('Video element found, setting up MediaSource...');
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', () =>
      this.sourceOpen(mediaSource, video)
    );
  }

  async sourceOpen(mediaSource: MediaSource, video: HTMLVideoElement) {
    console.log('MediaSource opened, adding source buffer...');
    const sourceBuffer = mediaSource.addSourceBuffer(
      'video/webm; codecs="vp8, vorbis"'
    );
    sourceBuffer.mode = 'sequence'; //sequence mode will assume that all processed data is related in the time context

    const response = await fetch(this.source!);
    const reader = response.body?.getReader();

    const stream = new ReadableStream({
      start: (controller) => {
        return this.processStream(reader!, controller);
      },
    });

    const responseStreamReader = stream.getReader();

    while (true) {
      const { done, value } = await responseStreamReader.read();
      if (done) {
        console.log('Stream reading done');
        break;
      }

      try {
        await this.waitForSourceBuffer(sourceBuffer);

        sourceBuffer.appendBuffer(value.buffer);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'QuotaExceededError'
        ) {
          console.warn(
            'Buffer full, waiting for updateend event to free up space'
          );

          //TODO: ----- Managing buffer is not finished yet, but it is acceptable for now -----
          await new Promise<void>(async (resolve) => {
            const checkBuffer = () => {
              console.log('CHECKING BUFFER!!');
              if (!sourceBuffer.updating) {
                console.log('REMOVE EVENT CHECK BUFFER');
                sourceBuffer.removeEventListener('updateend', checkBuffer);
                resolve();
              }
            };
            console.log('ADD EVENT CHECK BUFFER');
            sourceBuffer.addEventListener('updateend', checkBuffer);
            await this.waitForBufferChangeIndexPositionAndRemoveDataFromBuffer(
              sourceBuffer,
              this.videoElement.nativeElement
            );
          });

          try {
            console.log('RTRY TO FILL THE BUFFER ONCE AGAIN');
            await this.waitForSourceBuffer(sourceBuffer);
            sourceBuffer.appendBuffer(value.buffer);
          } catch (retryError) {
            console.error('Error appending buffer on retry:', retryError);
          }
          //---------------------------------------------------------------------------------------
        } else {
          console.error('Error appending buffer:', error);
        }
      }
    }

    await this.waitForSourceBuffer(sourceBuffer);
    mediaSource.endOfStream();
    console.log('MediaSource end of stream');
  }

  async processStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    controller: ReadableStreamDefaultController
  ) {
    const chunkSize = 64 * 1024; // 512 KB
    let buffer = new Uint8Array(0);

    const keyHex = CryptoJS.enc.Base64.parse(
      this._license?.keyData.key as string
    );
    let prevChunkIvHex = CryptoJS.enc.Base64.parse(
      this._license?.keyData.iv as string
    );

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        //TODO: Why this condition is not executed. Will it be an issue in some cases???
        console.log('Last frame...');
        if (buffer.length > 0) {
          console.log('Proceed with last frame...');
          const decryptedChunk = await this.decryptChunk(
            buffer,
            keyHex,
            prevChunkIvHex,
            CryptoJS.pad.Pkcs7
          );
          controller.enqueue(decryptedChunk);
        }
        controller.close();
        break;
      }

      const newBuffer = new Uint8Array(buffer.length + value.length);
      newBuffer.set(buffer);
      newBuffer.set(value, buffer.length);
      buffer = newBuffer;

      while (buffer.length >= chunkSize) {
        const chunk = buffer.slice(0, chunkSize);
        buffer = buffer.slice(chunkSize);

        const decryptedChunk = await this.decryptChunk(
          chunk,
          keyHex,
          prevChunkIvHex,
          CryptoJS.pad.NoPadding
        );
        prevChunkIvHex = CryptoJS.lib.WordArray.create(chunk.slice(-16)); // Update IV to last 16 bytes of chunk
        controller.enqueue(decryptedChunk);
      }
    }
  }

  async decryptChunk(
    chunk: Uint8Array,
    keyHex: WordArray,
    ivHex: WordArray,
    padding: Padding
  ): Promise<Uint8Array> {
    if (
      keyHex.sigBytes !== 16 &&
      keyHex.sigBytes !== 24 &&
      keyHex.sigBytes !== 32
    ) {
      console.error('Invalid key length:', keyHex.sigBytes);
      throw new Error(
        'Invalid key length: AES key data must be 128, 192, or 256 bits'
      );
    }

    if (ivHex.sigBytes !== 16) {
      console.error('Invalid IV length:', ivHex.sigBytes);
      throw new Error('Invalid IV length: AES IV data must be 128 bits');
    }

    const wordArrayChunk = CryptoJS.lib.WordArray.create(chunk);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: wordArrayChunk,
    });

    try {
      const decryptedChunk = CryptoJS.AES.decrypt(cipherParams, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: padding,
      }).toString(CryptoJS.enc.Latin1);

      const decryptedBytes = new Uint8Array(decryptedChunk.length).map((_, j) =>
        decryptedChunk.charCodeAt(j)
      );
      return decryptedBytes;
    } catch (e) {
      console.error('Decryption error:', e);
      throw e;
    }
  }

  async waitForSourceBuffer(sourceBuffer: SourceBuffer): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (!sourceBuffer.updating) {
          console.log('Source buffer not updating, resolving promise');
          resolve();
        } else {
          console.log('Source buffer updating, waiting...');
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  //TODO: ----- Managing buffer is not finished yet, but it is acceptable for now -----
  async waitForBufferChangeIndexPositionAndRemoveDataFromBuffer(
    sourceBuffer: SourceBuffer,
    videoElement: HTMLVideoElement
  ): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        const duration = videoElement.duration;
        const currentTime = videoElement.currentTime;
        const bufferEnd =
          sourceBuffer.buffered.length > 0 ? sourceBuffer.buffered.end(0) : 0;

        if (currentTime > duration / 3) {
          // Remove first 0.25 time of the content
          const removeEnd = duration / 4;
          if (sourceBuffer.buffered.length > 0 && bufferEnd > removeEnd) {
            sourceBuffer.remove(0, removeEnd);
            console.log('Player buffer has enough space to remove');
            resolve();
          } else {
            console.log('Buffer end is not greater than remove end');
            setTimeout(check, 50);
          }
        } else {
          console.log(
            'Waiting for playback to reach one third of the video duration...'
          );
          setTimeout(check, 50);
        }
      };
      check();
    });
  }
  //-----------------------------------------------------------------------------------------
}
