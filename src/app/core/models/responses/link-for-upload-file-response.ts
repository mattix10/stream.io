import { Response } from './response';

export type LinkForUploadFileResponse = Response<UrlResponse>;
interface UrlResponse {
  url: string;
}
