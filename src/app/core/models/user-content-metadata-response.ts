import { BaseMovieMetadata } from './base-movie-metadata';
import { FileStatus } from './file-status';
import { LicenseRule } from './license-rule';

export interface UserContentMetadataResponse {
  result: UserContentMetadata[];
}

export interface UserContentMetadata extends BaseMovieMetadata {
  imageStatus: FileStatus;
  movieStatus: FileStatus;
  licenseRules: LicenseRule[];
}
