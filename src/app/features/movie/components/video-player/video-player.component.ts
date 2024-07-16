import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  @Input() imageUrl = '';

  source?: string;
  readonly #authService = inject(AuthService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;

  @Input() set movieLink(source: string) {
    this.source = source;
  }
}
