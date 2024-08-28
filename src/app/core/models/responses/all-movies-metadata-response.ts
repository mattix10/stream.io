import { ContentMetadata } from '../interfaces/content-metadata';
import { Response } from './response';

export type AllMoviesMetadataResponse = Response<MoviesMetadataResponse>;

interface MoviesMetadataResponse {
  contents: ContentMetadata[];
  count: number;
}
