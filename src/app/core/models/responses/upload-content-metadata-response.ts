export interface UploadContentMetadataResponse {
  message: string;
  result: ContentId;
}

interface ContentId {
  contentId: string;
}
