import { LicenseRule } from '../interfaces/license-rule';

export interface UpdateContentMetadataRequest {
  title: string;
  description: string;
  licenseRules: LicenseRule[];
}
