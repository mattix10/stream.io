import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { MovieMetadata } from '../../models/movie-metadata';

@Injectable()
export class MovieMetadataService {
  #httpClient = inject(HttpClient);

  uploadMovieMetadata(
    title: string,
    description: string
  ): Observable<MovieMetadata> {
    return this.#httpClient.post<MovieMetadata>(`${environment.API_URL}`, {
      title,
      description,
    });
  }
}
