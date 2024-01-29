import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { MovieItem } from '../../models/movie-item';
import { Observable, of } from 'rxjs';
import { Movie } from '../../models/movie';
import { HttpParams } from '@angular/common/http';
import { movieItems } from 'src/app/mocks/movie-items';
import { movies } from 'src/app/mocks/movies';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private httpService: HttpService) {}

  getMovies(params?: HttpParams): Observable<MovieItem[]> {
    // return this.httpService.getItems<MovieItem[]>('movies', params);
    return of(movieItems);
  }

  getMovie(id: string): Observable<Movie> {
    return of(movies[0]);
    // return this.httpService.getItem<Movie>('movies', id);
  }

  createMovie(id: string): Observable<MovieItem> {
    return this.httpService.getItem<MovieItem>('movies', id);
  }

  updateMovie(id: string, body: Movie): Observable<Movie> {
    return this.httpService.update('movies', id, body);
  }

  deleteMovie(id: string): Observable<void> {
    return this.httpService.delete('movies', id);
  }
}
