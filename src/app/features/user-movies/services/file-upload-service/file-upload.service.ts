import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { FileType } from '../../../user-movies/models/file-type';

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

  getLinkForUploadMovie(contentId: string): Observable<string> {
    // return of('ss');
    return this.getLinkForUpload(FileType.Movie, contentId);
  }

  getLinkForUploadImage(contentId: string): Observable<string> {
    return this.getLinkForUpload(FileType.Image, contentId);
  }

  private getLinkForUpload(
    fileType: FileType,
    contentId: string
  ): Observable<string> {
    const uploadLink = fileType == FileType.Movie ? '' : '/image';
    return this.#httpClient.get<string>(
      `${environment.API_URL}stream-uri/upload${uploadLink}/${contentId}`
    );
  }
}
