export interface AllMoviesMetadataResponse {
  result: ContentMetadata[];
  count: number;
}

export interface ContentMetadata {
  uuid: string;
  title: string;
  duration: number;
  imageUrl: string;
}
