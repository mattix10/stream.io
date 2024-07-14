export interface AllMoviesMetadataResponse {
  contents: ContentMetadata[];
  count: number;
}

export interface ContentMetadata {
  uuid: string;
  title: string;
  duration: number;
  imageUrl: string;
}
