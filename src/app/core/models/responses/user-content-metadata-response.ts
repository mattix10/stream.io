import { FileStatus } from 'src/app/features/user-movies/models/file-status';
import { BaseMovieMetadata } from '../base-movie-metadata';
import { LicenseRule } from '../license-rule';

export interface UserContentMetadataResponse {
  result: UserContentMetadataResult;
  message: string;
}

export interface UserContentMetadataResult {
  contentCreatorContents: UserContentMetadata[];
  count: number;
}
export interface UserContentMetadata extends BaseMovieMetadata {
  imageStatus: FileStatus;
  contentStatus: FileStatus;
  licenseRules: LicenseRule[];
}
