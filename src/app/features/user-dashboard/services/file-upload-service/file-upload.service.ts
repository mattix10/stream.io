import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { FileType } from '../../models/file-type';

@Injectable()
export class FileUploadService {
  #httpClient = inject(HttpClient);

  upload(file: File, uploadLink: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return of(true);
    return this.#httpClient.post(`${uploadLink}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getLinkForUploadMovie(): Observable<string> {
    // return of('ss');
    return this.getLinkForUpload(FileType.Movie);
  }

  getLinkForUploadImage(): Observable<string> {
    return this.getLinkForUpload(FileType.Image);
  }

  private getLinkForUpload(fileType: FileType): Observable<string> {
    const uploadLink = fileType == FileType.Movie ? 'Movie' : 'Image';
    return this.#httpClient.get<string>(
      `${environment.API_URL}upload${uploadLink}`
    );
  }
}
