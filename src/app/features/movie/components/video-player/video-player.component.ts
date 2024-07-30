import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { License } from 'src/app/core/models/responses/license-response';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  @Input() isLicenseValid = false;
  _license?: License;

  @Input() set license(license: License) {
    if (license) {
      this._license = license;
    }
    console.log(this._license);
  }

  source?: string;
  readonly #authService = inject(AuthService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;

  @Input() set movieLink(source: string) {
    this.source = source;
  }
}
