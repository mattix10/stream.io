import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AllMoviesMetadataResponse } from '../models/responses/all-movies-metadata-response';
import { UserContentMetadataResponse } from '../models/responses/user-content-metadata-response';
import { UploadContentMetadataResponse } from '../models/responses/upload-content-metadata-response';
import { CreateCommentRequest } from '../models/requests/create-comment-request';
import { MovieMetadataResponse } from '../models/responses/movie-metadata-response';
import { MovieLinkResponse } from '../models/responses/movie-link-response';
import { LoggerService } from './logger.service';
import { CreateContentMetadataRequest } from '../models/requests/create-content-metadata-request';
import { UpdateContentMetadataRequest } from '../models/requests/update-content-metadata-request';
import { UserContentMetadata } from '../models/interfaces/user-content-metadata';

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
  }

  getContent(uuid: string): Observable<MovieMetadataResponse> {
    return this.#httpService
      .getItem<MovieMetadataResponse>(`${this.#entity}`, uuid)
      .pipe(this.#loggerService.error('Nie udało się załadować danych.'));
  }

  createContent(
    contentMetadataRequest: CreateContentMetadataRequest
  ): Observable<UploadContentMetadataResponse> {
    return this.#httpService
      .create<UploadContentMetadataResponse, CreateContentMetadataRequest>(
        `${this.#entity}`,
        contentMetadataRequest
      )
      .pipe(
        this.#loggerService.error('Tworzenie metadanych nie powiodło się.'),
        tap(() =>
          this.#loggerService.success('Dane filmu zostały wgrane pomyślnie.')
        )
      );
  }

  updateContent(
    contentMetadataRequest: UpdateContentMetadataRequest,
    contentId: string
  ): Observable<UploadContentMetadataResponse> {
    return this.#httpService
      .update<UploadContentMetadataResponse, UpdateContentMetadataRequest>(
        `${this.#entity}/${contentId}`,
        contentMetadataRequest
      )
      .pipe(
        this.#loggerService.error('Edycja metadanych nie powiodła się.'),
        tap(() =>
          this.#loggerService.success(
            'Metadane zostały zaktualizowane pomyślnie.'
          )
        )
      );
  }

  getUserContentMetadataResponse(): Observable<UserContentMetadataResponse> {
    return this.#httpService
      .getItems<UserContentMetadataResponse>(`${this.#entity}/user`)
      .pipe(
        this.#loggerService.error('Nie udało się pobrać filmów użytkownika.')
      );
  }

  getVideoLink(uuid: string): Observable<MovieLinkResponse> {
    return this.#httpService
      .getItem(`uri/video/${uuid}`)
      .pipe(this.#loggerService.error<any>('Nie udało się załadować filmu.'));
  }

  deleteContent(uuid: string): Observable<void> {
    return this.#httpService.delete(`${this.#entity}/${uuid}`).pipe(
      this.#loggerService.error('Nie udało się usunąć filmu.'),
      tap(() => this.#loggerService.success('Film został usunięty pomyślnie'))
    );
  }

  createComment(commentRequest: CreateCommentRequest): Observable<void> {
    return this.#httpService
      .create<void, CreateCommentRequest>('comment', commentRequest)
      .pipe(this.#loggerService.error('Nie udało się dodać komentarza'));
  }
}
