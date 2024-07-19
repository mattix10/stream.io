import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { LicenseService } from 'src/app/core/services/license.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [AsyncPipe, HttpClientModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements AfterViewInit {
  @Input() imageUrl = '';
  @Input() source?: string;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  readonly #authService = inject(AuthService);
  readonly #licenseService = inject(LicenseService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;

  async ngAfterViewInit() { //console.log(this.source);
    if (this.source) {
      const video = this.videoElement.nativeElement;
      const config = [{
        initDataTypes: ['cenc'],
        videoCapabilities: [{
          contentType: 'video/mp4; codecs="avc1.42E01E"'
        }]
      }];

      video.addEventListener('encrypted', async (event: MediaEncryptedEvent) => {
        try {
          const session = await video.mediaKeys!.createSession();
          session.addEventListener('message', async (event: MediaKeyMessageEvent) => {
            try {
              const licenseResponse = await firstValueFrom(
                this.#licenseService.getLicense(event.message).pipe(
                  catchError(error => {
                    console.error('Failed to fetch license', error);
                    throw error;
                  })
                )
              );

              const key = new Uint8Array(licenseResponse.key);
              const iv = new Uint8Array(licenseResponse.iv);

              const keyAndIvBuffer = new Uint8Array(key.length + iv.length);
              keyAndIvBuffer.set(key, 0);
              keyAndIvBuffer.set(iv, key.length);

              await session.update(keyAndIvBuffer);
            } catch (err) {
              console.error('Error updating session with license:', err);
            }
          });
          await session.generateRequest(event.initDataType, event.initData!);
        } catch (err) {
          console.error('Error generating license request:', err);
        }
      });

      navigator.requestMediaKeySystemAccess('org.w3.clearkey', config)
        .then(keySystemAccess => keySystemAccess.createMediaKeys())
        .then(mediaKeys => video.setMediaKeys(mediaKeys))
        .catch(error => console.error('Failed to set MediaKeys:', error));

      video.src = this.source;
    }
  }
}
