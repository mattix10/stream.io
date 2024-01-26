import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from 'src/app/core/models/movie';

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
  movieList: MovieList[] = [];

  @Output() moviesChanged: EventEmitter<Movie[]> = new EventEmitter<Movie[]>();

  ngOnInit(): void {
    this.addExpandedtoMovieList();
  }

  toggleMovie(movieId: string): void {
    console.log(movieId);
    this.movieList = this.movieList.map((movie) =>
      movie.id === movieId ? { ...movie, isExpanded: !movie.isExpanded } : movie
    );
    console.log(this.movieList);
  }

  editMovie(movieId: string): void {}

  deleteMovie(movieId: string): void {
    const movies = this.movies.filter(({ id }) => id !== movieId);
    this.moviesChanged.emit(movies);
  }

  private addExpandedtoMovieList(): void {
    this.movieList = this.movies.map((movie) => ({
      ...movie,
      isExpanded: false,
    }));
  }
}
