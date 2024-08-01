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
    mediaSource.addEventListener('sourceopen', () => this.sourceOpen(mediaSource, video));
    video.src = URL.createObjectURL(mediaSource);
  }

async sourceOpen(mediaSource: MediaSource, video: HTMLVideoElement) {
    console.log('MediaSource opened, adding source buffer...');
    const mimeCodec = 'video/webm; codecs="vp8, vorbis"';
    if (MediaSource.isTypeSupported(mimeCodec)) {
      const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
      sourceBuffer.mode = 'sequence';

      const response = await fetch(this.source!);
      const arrayBuffer = await response.arrayBuffer();
      console.log('Fetch response:', response);
      console.log('ArrayBuffer:', arrayBuffer);

      //this.downloadArrayBuffer(arrayBuffer, 'video.mp4');

      sourceBuffer.addEventListener('error', (e) => {
        const errorEvent = e as any; // Using 'any' to log detailed error information
        console.error('SourceBuffer error:', e);
        console.error('Error details: ', {
          name: errorEvent.name,
          message: errorEvent.message,
          target: errorEvent.target,
          currentTarget: errorEvent.currentTarget,
          eventPhase: errorEvent.eventPhase
        });
      });

      sourceBuffer.addEventListener('updateend', () => {
        console.log({
          "sourceBuffer.updating": sourceBuffer.updating,
          "mediaSource.readyState": mediaSource.readyState
        });

        if (!sourceBuffer.updating && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
          //video.play();
        }
      });

      
      if(mediaSource.readyState == "open") {
        try {
          sourceBuffer.appendBuffer(arrayBuffer);
          console.log('Buffer added!!!!!!!!');
        } catch (error) {
          console.error('Error appending buffer:', error);
        }

      }
      
      try {
        video.play().then(() => {
          console.log('Video started playing');
        }).catch((error) => {
          console.error('Error starting video playback:', error);
        });
      } catch (error) {
        console.error('Error appending buffer:', error);
      }
      
      // await this.waitForSourceBuffer(sourceBuffer);
      // if (!sourceBuffer.updating && mediaSource.readyState === "open") {
      //     mediaSource.endOfStream();
      // }
      // console.log('MediaSource end of stream');
    } else {
      console.error('Unsupported MIME type or codec:', mimeCodec);
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

  downloadArrayBuffer(arrayBuffer: ArrayBuffer, filename: string) {
    const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  playVideo() {
    const video = this.videoElement.nativeElement;
    video.play().then(() => {
      console.log('Video started playing');
    }).catch((error) => {
      console.error('Error starting video playback:', error);
    });
  }

  // async processStream(reader: ReadableStreamDefaultReader<Uint8Array>, controller: ReadableStreamDefaultController) {
  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (done) {
  //       controller.close();
  //       break;
  //     }
  //     //console.log('Enqueuing chunk to stream:', value.byteLength);
  //     controller.enqueue(value);
  //   }
  // }
}
