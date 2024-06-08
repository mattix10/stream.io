import { BaseMovieMetadata } from './base-movie-metadata';

export interface UserMovieMetadata extends BaseMovieMetadata {
  license: string;
}
