import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { FileType } from '../../../user-movies/models/file-type';
import { LinkForUploadFileResponse } from 'src/app/core/models/responses/link-for-upload-file-response';
import { LoggerService } from 'src/app/core/services/logger.service';

@Injectable()
export class FileUploadService {
  #httpClient = inject(HttpClient);
  #loggerService = inject(LoggerService);

  upload(file: File, uploadLink: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.#httpClient
      .post(`${uploadLink}`, formData, {
        responseType: 'text',
      })
      .pipe(this.#loggerService.error('Pobieranie linku nie powiodło się.'));
  }

  getLinkForUploadMovie(
    contentId: string
  ): Observable<LinkForUploadFileResponse> {
    return this.getLinkForUpload(FileType.Movie, contentId).pipe(
      this.#loggerService.error('Wgrywanie filmu nie powiodło się.')
    );
  }

  getLinkForUploadImage(
    contentId: string
  ): Observable<LinkForUploadFileResponse> {
    return this.getLinkForUpload(FileType.Image, contentId).pipe(
      this.#loggerService.error('Wgrywanie obrazu nie powiodło się.')
    );
  }

  private getLinkForUpload(
    fileType: FileType,
    contentId: string
  ): Observable<LinkForUploadFileResponse> {
    const uploadLink = fileType == FileType.Movie ? 'video' : 'image';
    return this.#httpClient.get<LinkForUploadFileResponse>(
      `${environment.API_URL}uri/${uploadLink}/${contentId}`
    );
  }
}
