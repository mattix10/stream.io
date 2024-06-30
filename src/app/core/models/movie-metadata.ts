import { BaseMovieMetadata } from './base-movie-metadata';
import { LicenseRule } from './license-rule';
import { MovieComment } from './movie-comment';

export interface MovieMetadata extends BaseMovieMetadata {
  imageUrl: string;
  duration: number;
  licenseRules: LicenseRule[];
  comments: MovieComment[];
}
