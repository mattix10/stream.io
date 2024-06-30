import { LicenseRule } from '../license-rule';

export interface CreateMovieMetadataRequest {
  title: string;
  description: string;
  licenseRules: LicenseRule[];
}
