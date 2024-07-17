import { LicenseRule } from '../license-rule';

export interface UpdateContentMetadataRequest {
  title: string;
  description: string;
  licenseRules: LicenseRule[];
}
