export interface AllMoviesMetadataResponse {
  result: MoviesMetadataResponse;
  message: string;
}

interface MoviesMetadataResponse {
  contents: ContentMetadata[];
  count: number;
}

export interface ContentMetadata {
  uuid: string;
  title: string;
  duration: number;
  imageUrl: string;
}
