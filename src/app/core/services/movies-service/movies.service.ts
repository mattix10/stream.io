import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { MovieMetadata } from '../../models/movie-metadata';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Movie } from '../../models/movie';
import { HttpParams } from '@angular/common/http';
import { movieItems } from 'src/app/mocks/movie-items';
import { UserMovieMetadata } from '../../models/user-movie-metadata';
import { MovieComment } from '../../models/movie-comment';
import { comments } from 'src/app/mocks/comments';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  selectedMovieForEdit$ = new BehaviorSubject<UserMovieMetadata | null>(null);
  readonly #httpService = inject(HttpService);

  getMovies<T>(params?: HttpParams): Observable<T[]> {
    // return this.httpService.getItems<MovieMetadata[]>('movies', params);
    return of(movieItems as T[]);
  }

  getMovieMetadata(slug: string): Observable<MovieMetadata> {
    // return this.#httpService.getItem<MovieMetadata>(`movies`, slug);
    return of(movieItems[0]);
  }

  /**
   * Returns link to watch movie
   * @param {string} slug
   * @returns
   */

  getMovieLink(slug: string): Observable<string> {
    return of('./../../../../assets/movies/lord_of_the_rings.mp4');
    // return this.httpService.getItem<string>('movieLink', slug);
  }

  createMovie(slug: string): Observable<MovieMetadata> {
    return this.#httpService.getItem<MovieMetadata>('movies', slug);
  }

  updateMovie(slug: string, body: Movie): Observable<Movie> {
    return this.#httpService.update('movies', slug, body);
  }

  deleteMovie(slug: string): Observable<void> {
    return this.#httpService.delete('movies', slug);
  }

  getComments(slug: string): Observable<MovieComment[]> {
    // const params = new HttpParams().set('slug', 12);
    // return this.#httpService.getItems('comments', params);
    return of(comments);
  }
}
