import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { MovieMetadata } from '../../models/movie-metadata';

@Injectable()
export class MovieMetadataService {
  #httpClient = inject(HttpClient);

  uploadMovieMetadata(title: string, description: string): Observable<boolean> {
    // return throwError(() => new Error('error'));
    return of(true);

    // return this.#httpClient.post<boolean>(`${environment.API_URL}`, {
    //   title,
    //   description,
    // }).pipe();
  }
}
