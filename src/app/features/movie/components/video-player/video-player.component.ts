import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { License } from 'src/app/core/models/responses/license-response';
import { AuthService } from 'src/app/core/services/auth.service';
import { LicenseService } from '../../services/license.service';
import * as shaka from 'shaka-player';

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
      await this.initializeShakaPlayer();
    }
  }

  async initializeShakaPlayer(): Promise<void> {
    const video = this.videoElement.nativeElement;
    if (!video) return;

    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
      const player = new shaka.Player(video);
      player.addEventListener('error', this.onErrorEvent);

      try {
        await player.load(this.source!);
        console.log('The video has now been loaded!');
      } catch (error) {
        console.error('Error loading video:', error);
      }
    } else {
      console.error('Browser not supported!');
    }
  }

  onErrorEvent(event: any): void {
    console.error('Error code', event.detail.code, 'object', event.detail);
  }
}
