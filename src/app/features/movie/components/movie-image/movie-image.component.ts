import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { isLoading } from '@app/core/models/interfaces/loading';
import { AuthService } from '@app/core/services/auth.service';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-movie-image',
  imports: [AsyncPipe, SpinnerComponent],
  templateUrl: './movie-image.component.html',
  styleUrl: './movie-image.component.scss',
})
export class MovieImageComponent implements isLoading {
  @Input() imageUrl = '';
  @Input() isLoading = false;

  readonly #authService = inject(AuthService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;
}
