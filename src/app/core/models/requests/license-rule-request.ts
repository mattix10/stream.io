import { LicenseRule } from '../interfaces/license-rule';

export interface LicenseRuleRequest {
  contentId: string;
  licenseRulesModel: LicenseRule;
}
