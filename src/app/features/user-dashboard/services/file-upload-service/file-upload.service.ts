import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable()
export class FileUploadService {
  #httpClient = inject(HttpClient);

  upload(file: File, uploadLink: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.#httpClient.post(`${uploadLink}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getLinkForUploadMovie(): Observable<string> {
    return this.#httpClient.get<string>(`${environment.API_URL}upload`);
  }
}
