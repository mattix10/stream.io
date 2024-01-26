import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MovieItemComponent } from './movie-item/movie-item.component';
import { MovieItem } from 'src/app/core/models/movie-item';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  movieItems$: Observable<MovieItem[]> = of([]);

  readonly #movieService = inject(MoviesService);
  readonly #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.movieItems$ = this.#movieService
      .getMovies()
      .pipe(takeUntilDestroyed(this.#destroyRef));
  }
}
