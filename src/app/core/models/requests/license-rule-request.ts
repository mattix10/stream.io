import { LicenseRule } from '../license-rule';

export interface LicenseRuleRequest {
  contentId: string;
  licenseRulesModel: LicenseRule;
}
