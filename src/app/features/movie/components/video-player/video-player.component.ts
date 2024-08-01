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
    video.src = this.source;//URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', () => this.sourceOpen(mediaSource, video));
  }

  async sourceOpen(mediaSource: MediaSource, video: HTMLVideoElement) {
    console.log('MediaSource opened, adding source buffer...');
    const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    sourceBuffer.mode = 'sequence';

    const response = await fetch(this.source!);
    const reader = response.body?.getReader();
    console.log('Fetch response:', response);
    console.log('Response reader:', reader);

    const stream = new ReadableStream({
      start: (controller) => {
        return this.processStream(reader!, controller);
      }
    });

    const responseStreamReader = stream.getReader();
    let firstChunkAppended = false;

    sourceBuffer.addEventListener('updateend', () => {
      if (mediaSource.readyState === 'open' && video.paused) {
        video.play().then(() => {
          console.log('Video started playing');
        }).catch((error) => {
          console.error('Error starting video playback:', error);
        });
      }
    });

    while (true) {
      const { done, value } = await responseStreamReader.read();
      if (done) {
        console.log('Stream reading done');
        break;
      }
      console.log('Appending buffer to source buffer:', value.byteLength);

      try {
        await this.waitForSourceBuffer(sourceBuffer);
        sourceBuffer.appendBuffer(value.buffer);

        if (!firstChunkAppended) {
          firstChunkAppended = true;
          video.play().then(() => {
            console.log('Video started playing');
          }).catch((error) => {
            console.error('Error starting video playback:', error);
          });
        }

      } catch (error) {
        console.error('Error appending buffer:', error);
      }
    }

    await this.waitForSourceBuffer(sourceBuffer);
    mediaSource.endOfStream();
    console.log('MediaSource end of stream');
  }

  async processStream(reader: ReadableStreamDefaultReader<Uint8Array>, controller: ReadableStreamDefaultController) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        break;
      }
      console.log('Enqueuing chunk to stream:', value.byteLength);
      controller.enqueue(value);
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
