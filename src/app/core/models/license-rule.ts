import { LicenseDuration } from './license-duration.enum';
import { LicenseType } from './license-type.enum';

export interface LicenseRule {
  price: number;
  type: LicenseType;
  duration?: LicenseDuration | null;
}
