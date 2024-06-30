import { FileStatus } from './file-status';
import { LicenseRule } from './license-rule';

export interface UserMoviesMetadataResponse {
  uuid: string;
  title: string;
  description: string;
  imageStatus: FileStatus;
  movieStatus: FileStatus;
  licenseRules: LicenseRule[];
}
