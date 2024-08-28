import { Response } from './response';

export type UploadContentMetadataResponse = Response<ContentId>;

interface ContentId {
  contentId: string;
}
