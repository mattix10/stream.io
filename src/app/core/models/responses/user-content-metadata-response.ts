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
  licenseRules: LicenseRule[];
}
