import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ContentMetadata } from 'src/app/core/models/responses/all-movies-metadata-response';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss',
})
export class MovieMetadataComponent {
  @Input() movieMetadata!: ContentMetadata;

  readonly #router = inject(Router);

  protected navigateToMovieDetails(): void {
    this.#router.navigate(['/movie', this.movieMetadata.uuid], {
      state: { movieMetadata: this.movieMetadata },
    });
  }
}
