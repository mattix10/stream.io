import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { License } from 'src/app/core/models/responses/license-response';
import { AuthService } from 'src/app/core/services/auth.service';
import { LicenseService } from '../../services/license.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
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
  readonly #licenseService = inject(LicenseService);
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
    mediaSource.addEventListener('sourceopen', () => this.sourceOpen(mediaSource, video));
  }

  async sourceOpen(mediaSource: MediaSource, video: HTMLVideoElement) {
    console.log('MediaSource opened, adding source buffer...');
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8, vorbis"');
    sourceBuffer.mode = 'sequence'; //TODO: check other options

    const keyData = this._license?.keyData;
    console.log('Key data:', keyData);

    const response = await fetch(this.source!);
    //const reader = response.body?.getReader();
    const arrayBuffer = await response.arrayBuffer();
    console.log('Fetch response:', response);
    //console.log('Response reader:', reader);

    // const stream = new ReadableStream({
    //   start: (controller) => {
    //     return this.processStream(reader!, keyData, controller);
    //   }
    // });

    //const responseStreamReader = stream.getReader();
    //let firstChunkAppended = false;

    sourceBuffer.addEventListener('updateend', () => {
      if (mediaSource.readyState === 'open' && video.paused) {
        video.play().then(() => {
          console.log('Video started playing');
        }).catch((error) => {
          console.error('Error starting video playback:', error);
        });
      }
    });

    let decryptedBuffer = await this.decryptBuffer(arrayBuffer, keyData);
    sourceBuffer.appendBuffer(decryptedBuffer);

    // while (true) {
    //   const { done, value } = await responseStreamReader.read();
    //   if (done) {
    //     console.log('Stream reading done');
    //     break;
    //   }
    //   console.log('Appending buffer to source buffer:', value.byteLength);

    //   try {
    //     await this.waitForSourceBuffer(sourceBuffer);
    //     sourceBuffer.appendBuffer(value.buffer);

    //     if (!firstChunkAppended) {
    //       firstChunkAppended = true;
    //       video.play().then(() => {
    //         console.log('Video started playing');
    //       }).catch((error) => {
    //         console.error('Error starting video playback:', error);
    //       });
    //     }

    //   } catch (error) {
    //     console.error('Error appending buffer:', error);
    //   }
    // }

    //await this.waitForSourceBuffer(sourceBuffer);
    mediaSource.endOfStream();
    console.log('MediaSource end of stream');
  }

  async processStream(reader: ReadableStreamDefaultReader<Uint8Array>, keyData: any, controller: ReadableStreamDefaultController) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        break;
      }
      await this.decryptChunk(value, keyData);
      console.log('Enqueuing chunk to stream:', value.byteLength);
      controller.enqueue(value);
    }
  }

  async decryptBuffer(buffer: ArrayBuffer, keyData: any): Promise<Uint8Array> {
    console.log('Decrypting chunk with keyData:', keyData);
    const key = this.base64ToArrayBuffer(keyData.key);
    const iv = this.base64ToArrayBuffer(keyData.iv);
    console.log('Key:', key);
    console.log('IV:', iv);

    if (key.byteLength !== 16 && key.byteLength !== 24 && key.byteLength !== 32) {
      console.error('Invalid key length:', key.byteLength);
      throw new Error('Invalid key length: AES key data must be 128, 192, or 256 bits');
    }

    if (iv.byteLength !== 16) {
      console.error('Invalid IV length:', iv.byteLength);
      throw new Error('Invalid IV length: AES IV data must be 128 bits');
    }

    // Proceed with actual decryption
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    console.log('chunk:!!!!');
    console.log(buffer);
    try {
      const decryptedArrayBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        buffer //TODO: try chunk
      );

      console.log('Decrypted buffer:', new Uint8Array(decryptedArrayBuffer));
      return new Uint8Array(decryptedArrayBuffer);
    } catch (e) {
      console.error('Decryption error:', e);
      throw e;
    }
  }

  async decryptChunk(chunk: Uint8Array, keyData: any): Promise<Uint8Array> {
    console.log('Decrypting chunk with keyData:', keyData);
    const key = this.base64ToArrayBuffer(keyData.key);
    const iv = this.base64ToArrayBuffer(keyData.iv);
    console.log('Key:', key);
    console.log('IV:', iv);

    if (key.byteLength !== 16 && key.byteLength !== 24 && key.byteLength !== 32) {
      console.error('Invalid key length:', key.byteLength);
      throw new Error('Invalid key length: AES key data must be 128, 192, or 256 bits');
    }

    if (iv.byteLength !== 16) {
      console.error('Invalid IV length:', iv.byteLength);
      throw new Error('Invalid IV length: AES IV data must be 128 bits');
    }

    // Proceed with actual decryption
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    console.log('chunk:!!!!');
    console.log(chunk);
    console.log(chunk.buffer);
    try {
      const decryptedArrayBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        chunk.buffer //TODO: try chunk
      );

      console.log('Decrypted buffer:', new Uint8Array(decryptedArrayBuffer));
      return new Uint8Array(decryptedArrayBuffer);
    } catch (e) {
      console.error('Decryption error:', e);
      throw e;
    }
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    try {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (e) {
      console.error('Failed to decode Base64 string:', base64, e);
      throw e;
    }
  }

  waitForSourceBuffer(sourceBuffer: SourceBuffer): Promise<void> {
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
}
