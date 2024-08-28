import { BaseMovieMetadata } from './base-movie-metadata';
import { LicenseRule } from './license-rule';

export interface UserContentMetadata extends BaseMovieMetadata {
  licenseRules: LicenseRule[];
}
