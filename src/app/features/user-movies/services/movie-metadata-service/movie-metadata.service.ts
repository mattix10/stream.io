import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { UploadContentMetadataRequest } from 'src/app/core/models/requests/upload-movie-metadata-request';

@Injectable()
export class MovieMetadataService {
  #httpClient = inject(HttpClient);

  uploadContentMetadata(
    contentMetadataRequest: UploadContentMetadataRequest
  ): Observable<{ contentId: string }> {
    console.log(contentMetadataRequest);
    // return throwError(() => new Error('error'));
    return of({ contentId: 'ttt' });

    // return this.#httpClient
    //   .post<boolean>(`${environment.API_URL}`, {
    //     contentMetadataRequest,
    //   })
    //   .pipe();
  }
}
