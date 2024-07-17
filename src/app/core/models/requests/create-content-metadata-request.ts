import { LicenseRule } from '../license-rule';

export interface CreateContentMetadataRequest {
  title: string;
  description: string;
  licenseRules: LicenseRule[];
  imageFileId: string;
  videoFileId: string;
}
