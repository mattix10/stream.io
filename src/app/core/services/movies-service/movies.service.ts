import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { MovieMetadata } from '../../models/movie-metadata';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { movieItems } from 'src/app/mocks/movie-items';
import { UserMovieMetadata } from '../../models/user-movie-metadata';
import { MovieComment } from '../../models/movie-comment';
import { comments } from 'src/app/mocks/comments';
import { getUserMoviesMetadataResponse } from 'mocks/get-user-movies-metadata';
import { UserMoviesMetadataResponse } from '../../models/user-movies-metadata';
import { AllMoviesMetadataResponse } from '../../models/all-movies-metadata-response';
import { getAllMoviesMetadata } from 'mocks/get-all-movies-metadata';
import { CreateMovieMetadataRequest } from '../../models/requests/create-movie-metadata-request';

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

  getMovieMetadata(uuid: string): Observable<MovieMetadata> {
    // return this.#httpService.getItem<MovieMetadata>(`movies`, uuid);
    return of(movieItems[0]);
  }

  getUserMoviesMetadataResponse(): Observable<UserMoviesMetadataResponse[]> {
    return of(getUserMoviesMetadataResponse);

    return this.#httpService.getItems<UserMoviesMetadataResponse[]>('movies');
  }

  getAllMoviesMetadata(
    params?: HttpParams
  ): Observable<AllMoviesMetadataResponse> {
    // return this.#httpService.getItems<MovieMetadata[]>('movies', params);
    return of(getAllMoviesMetadata);
  }

  /**
   * Returns link to watch movie
   * @param {string} uuid
   * @returns {Observable<string>}
   */

  getMovieLink(uuid: string): Observable<string> {
    return of('./../../../../assets/movies/lord_of_the_rings.mp4');
    // return this.httpService.getItem<string>('movieLink', uuid);
  }

  getComments(uuid: string): Observable<MovieComment[]> {
    // const params = new HttpParams().set('uuid', 12);
    // return this.#httpService.getItems('comments', params);
    return of(comments);
  }

  createMovie(uuid: string): Observable<MovieMetadata> {
    return this.#httpService.getItem<MovieMetadata>('movies', uuid);
  }

  createMovieMetadata(movieMetadataRequest: CreateMovieMetadataRequest) {
    return this.#httpService.create<CreateMovieMetadataRequest>(
      'content',
      movieMetadataRequest
    );
  }

  updateMovie(body: MovieMetadata, uuid: string): Observable<MovieMetadata> {
    return this.#httpService.update('movies', body, uuid);
  }

  deleteMovie(uuid: string): Observable<void> {
    return this.#httpService.delete('movies', uuid);
  }

  postComment(comment: string): Observable<string> {
    return this.#httpService.create<string>('comments', comment);
  }
}
