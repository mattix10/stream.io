export interface AllMoviesMetadataResponse {
  result: ContentMetadata[];
  count: number;
}

interface ContentMetadata {
  uuid: string;
  title: string;
  duration: number;
  imageUrl: string;
}
