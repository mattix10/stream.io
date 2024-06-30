import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UserContentMetadata } from 'src/app/core/models/user-content-metadata-response';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { FileStatusDirective } from 'src/app/features/user-movies/directives/file-status.directive';
import { FileStatusPipe } from 'src/app/features/user-movies/pipes/file-status.pipe';

type MovieListItem = UserContentMetadata & {
  isExpanded: boolean;
};
@Component({
  selector: 'app-expansion-panel-movie',
  standalone: true,
  imports: [CommonModule, FileStatusPipe, FileStatusDirective],
  templateUrl: './expansion-panel-movie.component.html',
  styleUrl: './expansion-panel-movie.component.scss',
})
export class ExpansionPanelMovieComponent implements OnInit {
  @Input() movies: UserContentMetadata[] = [];
  @Output() removeMovieChanged = new EventEmitter<string>();

  movieList: MovieListItem[] = [];

  readonly #moviesService = inject(MoviesService);

  ngOnInit(): void {
    this.addExpandedtoMovieList();
    console.log(this.movies);
  }

  toggleMovie(uuid: string): void {
    this.movieList = this.movieList.map((movie) =>
      movie.uuid === uuid ? { ...movie, isExpanded: !movie.isExpanded } : movie
    );
  }

  editMovie(uuid: string): void {
    const movie = this.movieList.find((movie) => movie.uuid === uuid);
    if (!movie) return;
    this.#moviesService.selectedMovieForEdit$.next(movie);
  }

  deleteMovie(uuid: string): void {
    this.removeMovieChanged.emit(uuid);
  }

  private addExpandedtoMovieList(): void {
    this.movieList = this.movies.map((movie) => ({
      ...movie,
      isExpanded: false,
    }));
  }
}
