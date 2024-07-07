import { Component, OnInit, inject } from '@angular/core';
import { MovieMetadataComponent } from './movie-item/movie-item.component';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';
import {
  AllMoviesMetadataResponse,
  ContentMetadata,
} from 'src/app/core/models/responses/all-movies-metadata-response';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieMetadataComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  movieMetadataList: ContentMetadata[] = [];

  readonly #movieService = inject(MoviesService);

  ngOnInit(): void {
    this.getMovies();
  }

  private getMovies(): void {
    this.#movieService
      .getMovies<MovieMetadata>()
      .pipe(
        tap(
          ({ result }: AllMoviesMetadataResponse) =>
            (this.movieMetadataList = result)
        )
      )
      .subscribe();
  }
}
