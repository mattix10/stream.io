import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Movie } from 'src/app/core/models/movie';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';

type MovieList = Movie & {
  isExpanded: boolean;
};
@Component({
  selector: 'app-expansion-panel-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel-movie.component.html',
  styleUrl: './expansion-panel-movie.component.scss',
})
export class ExpansionPanelMovieComponent implements OnInit {
  @Input() movies: Movie[] = [];
  @Output() removeMovieChanged = new EventEmitter<string>();

  movieList: MovieList[] = [];

  readonly #moviesService = inject(MoviesService);

  ngOnInit(): void {
    this.addExpandedtoMovieList();
  }

  toggleMovie(movieId: string): void {
    this.movieList = this.movieList.map((movie) =>
      movie.id === movieId ? { ...movie, isExpanded: !movie.isExpanded } : movie
    );
  }

  editMovie(movieId: string): void {
    const movie = this.movieList.find((movie) => movie.id === movieId);
    if (!movie) {
      return;
    }
    this.#moviesService.selectedMovieForEdit$.next(movie);
  }

  deleteMovie(movieId: string): void {
    this.removeMovieChanged.emit(movieId);
  }

  private addExpandedtoMovieList(): void {
    this.movieList = this.movies.map((movie) => ({
      ...movie,
      isExpanded: false,
    }));
  }
}
