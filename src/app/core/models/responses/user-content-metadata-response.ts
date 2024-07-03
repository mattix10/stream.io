import { FileStatus } from 'src/app/features/user-movies/models/file-status';
import { BaseMovieMetadata } from '../base-movie-metadata';
import { LicenseRule } from '../license-rule';

export interface UserContentMetadataResponse {
  result: UserContentMetadata[];
}

export interface UserContentMetadata extends BaseMovieMetadata {
  imageStatus: FileStatus;
  movieStatus: FileStatus;
  licenseRules: LicenseRule[];
}
