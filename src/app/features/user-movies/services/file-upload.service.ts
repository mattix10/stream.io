import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { LinkForUploadFileResponse } from 'src/app/core/models/responses/link-for-upload-file-response';
import { Response } from 'src/app/core/models/response';
import { LoggerService } from 'src/app/core/services/logger.service';
import { FileType } from '../models/file-type';

@Injectable()
export class FileUploadService {
  #httpClient = inject(HttpClient);
  #loggerService = inject(LoggerService);

  upload<T>(file: File, uploadLink: string): Observable<Response<T>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.#httpClient
      .post<Response<T>>(`${uploadLink}`, formData)
      .pipe(this.#loggerService.error('Wgrywanie pliku nie powiodło się.'));
  }

  getVideoLink(): Observable<LinkForUploadFileResponse> {
    return this.getLinkForUpload(FileType.Movie).pipe(
      this.#loggerService.error(
        'Pobieranie linku dla uploadu wideo nie powiodło się.'
      )
    );
  }

  // getVideoLinkForContent(
  //   contentId: string
  // ): Observable<LinkForUploadFileResponse> {
  //   return this.getLinkForUpload(FileType.Movie, contentId).pipe(
  //     this.#loggerService.error(
  //       'Pobieranie linku dla uploadu wideo nie powiodło się.'
  //     )
  //   );
  // }

  getImageLink(): Observable<LinkForUploadFileResponse> {
    return this.getLinkForUpload(FileType.Image).pipe(
      this.#loggerService.error(
        'Pobieranie linku dla uplaodu obrazu nie powiodło się.'
      )
    );
  }

  private getLinkForUpload(
    fileType: FileType
  ): Observable<LinkForUploadFileResponse> {
    const uploadLink = fileType == FileType.Movie ? 'video' : 'image';
    return this.#httpClient.get<LinkForUploadFileResponse>(
      `${environment.API_URL}uri/${uploadLink}`
    );
  }
}
