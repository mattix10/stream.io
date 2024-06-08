import { BaseMovieMetadata } from './base-movie-item';

export interface UserMovieMetadata extends BaseMovieMetadata {
  license: string;
}
