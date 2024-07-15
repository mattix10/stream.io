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
import { MovieMetadataResponse } from '../models/responses/movie-metadata-response';
import { MovieLinkResponse } from '../models/responses/movie-link-response';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  selectedMovieForEdit$ = new BehaviorSubject<UserContentMetadata | null>(null);
  readonly #httpService = inject(HttpService);
  readonly #loggerService = inject(LoggerService);
  readonly #entity = 'content';

  getMovies(params?: HttpParams): Observable<AllMoviesMetadataResponse> {
    return this.#httpService
      .getItems<AllMoviesMetadataResponse>(`${this.#entity}/all`, params)
      .pipe(
        this.#loggerService.error(
          'Wystąpił błąd. Nie udało się załadować filmów.'
        )
      );
    // return of(getAllMoviesMetadata);
  }

  getContent(uuid: string): Observable<MovieMetadataResponse> {
    return this.#httpService.getItem<MovieMetadataResponse>(
      `${this.#entity}`,
      uuid
    );
    // return of(movieItems[0]);
  }

  createContent(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<UploadContentMetadataResponse> {
    console.log(contentMetadataRequest);
    // return throwError(() => new Error('error'));
    return this.#httpService
      .create<UploadContentMetadataResponse, UploadContentMetadataRequest>(
        `${this.#entity}asdasd`,
        contentMetadataRequest
      )
      .pipe(
        this.#loggerService.error('Wgrywanie metadanych nie powiodło się.')
      );
  }

  updateContent(
    contentMetadataRequest: UploadContentMetadataRequest,
    contentId: string
  ): Observable<UploadContentMetadataResponse> {
    console.log(contentMetadataRequest, contentId);
    return this.#httpService
      .update<UploadContentMetadataResponse, UploadContentMetadataRequest>(
        `${this.#entity}/${contentId}`,
        contentMetadataRequest
      )
      .pipe(
        this.#loggerService.error('Wgrywanie metadanych nie powiodło się.')
      );
    // return of({ contentId: 'ttt' });
  }

  getUserContentMetadataResponse(): Observable<UserContentMetadataResponse> {
    // return of(getUserMoviesMetadataResponse);

    return this.#httpService
      .getItems<UserContentMetadataResponse>(`${this.#entity}/user`)
      .pipe(
        this.#loggerService.error('Nie udało się pobrać filmów użytkownika.')
      );
  }

  /**
   * Returns link to watch movie
   * @param {string} uuid
   * @returns {Observable<string>}
   */

  getMovieLink(uuid: string): Observable<MovieLinkResponse> {
    return this.#httpService.getItem(`uri/video/${uuid}`);
    // return of('./../../../../assets/movies/lord_of_the_rings.mp4');
    // return this.httpService.getItem<string>('movieLink', uuid);
  }

  deleteContent(uuid: string): Observable<void> {
    return this.#httpService
      .delete(this.#entity, undefined, {
        contentId: uuid,
      })
      .pipe(this.#loggerService.error('Nie udało się usunąć filmu.'));
  }

  createComment(commentRequest: CreateCommentRequest): Observable<void> {
    return this.#httpService.create<void, CreateCommentRequest>(
      'comment',
      commentRequest
    );
  }
}
