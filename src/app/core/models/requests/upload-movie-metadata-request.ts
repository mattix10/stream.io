import { LicenseRule } from '../license-rule';

export interface UploadContentMetadataRequest {
  title: string;
  description: string;
  licenseRules: LicenseRule[];
}
