import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ContentMetadata } from 'src/app/core/models/interfaces/content-metadata';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss',
})
export class MovieItemComponent {
  @Input() contentMetadata!: ContentMetadata;

  readonly #router = inject(Router);

  protected navigateToMovieDetails(): void {
    this.#router.navigate(['/movie', this.contentMetadata.uuid]);
  }
}
