import { LicenseDuration } from '../enums/license-duration.enum';
import { LicenseType } from '../enums/license-type.enum';

export interface LicenseRule {
  price: number;
  type: LicenseType;
  duration?: LicenseDuration | null;
}
