import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MovieMetadata } from '../models/movie-metadata';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MovieComment } from '../models/movie-comment';
import { getUserMoviesMetadataResponse } from 'mocks/get-user-movies-metadata';
import { AllMoviesMetadataResponse } from '../models/responses/all-movies-metadata-response';
import { getAllMoviesMetadata } from 'mocks/get-all-movies-metadata';
import { UploadContentMetadataRequest } from '../models/requests/upload-movie-metadata-request';
import {
  UserContentMetadata,
  UserContentMetadataResponse,
} from '../models/responses/user-content-metadata-response';
import { movieItems } from 'mocks/movie-items';
import { UploadContentMetadataResponse } from '../models/responses/upload-content-metadata-response';
import { CreateCommentRequest } from '../models/requests/create-comment-request';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  selectedMovieForEdit$ = new BehaviorSubject<UserContentMetadata | null>(null);
  readonly #httpService = inject(HttpService);
  readonly #entity = 'content';

  getMovies(params?: HttpParams): Observable<AllMoviesMetadataResponse> {
    // return this.#httpService.getItems<AllMoviesMetadataResponse>(
    //   `${this.#entity}/all`,
    //   params
    // );
    return of(getAllMoviesMetadata);
  }

  getContentMetadata(uuid: string): Observable<MovieMetadata> {
    // return this.#httpService.getItem<MovieMetadata>(`${this.#entity}`, uuid);
    return of(movieItems[0]);
  }

  createContentMetadata(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<UploadContentMetadataResponse> {
    console.log(contentMetadataRequest);
    // return throwError(() => new Error('error'));
    return this.#httpService.create<
      UploadContentMetadataResponse,
      UploadContentMetadataRequest
    >(`${this.#entity}`, contentMetadataRequest);
    return of({ contentId: 'ttt' });

    // return this.#httpClient
    //   .post<boolean>(`${environment.API_URL}`, {
    //     contentMetadataRequest,
    //   })
    //   .pipe();
  }

  updateContentMetadata(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<{ contentId: string }> {
    console.log(contentMetadataRequest);
    // return throwError(() => new Error('error'));
    return of({ contentId: 'ttt' });

    // return this.#httpClient
    //   .put<boolean>(`${environment.API_URL}`, {
    //     contentMetadataRequest,
    //   })
    //   .pipe();
  }

  getUserContentMetadataResponse(): Observable<UserContentMetadataResponse> {
    return of(getUserMoviesMetadataResponse);

    // return this.#httpService.getItems<UserContentMetadataResponse[]>(`${this.#entity}/user`);
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

  createMovie(uuid: string): Observable<MovieMetadata> {
    return this.#httpService.getItem<MovieMetadata>('movies', uuid);
  }

  // createMovieMetadata(movieMetadataRequest: UploadContentMetadataRequest) {
  //   return this.#httpService.create<UploadContentMetadataRequest>(
  //     'content',
  //     movieMetadataRequest
  //   );
  // }

  updateMovie(body: MovieMetadata, uuid: string): Observable<MovieMetadata> {
    return this.#httpService.update('movies', body, uuid);
  }

  deleteMovie(uuid: string): Observable<void> {
    return this.#httpService.delete('movies', uuid);
  }

  createComment(commentRequest: CreateCommentRequest): Observable<void> {
    return this.#httpService.create<void, CreateCommentRequest>(
      'comment',
      commentRequest
    );
  }
}
