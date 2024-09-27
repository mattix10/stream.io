import { LicenseTypeLabel, licenseTypeLabels } from './license-type-labels';

export const licenseTypeOptions: LicenseTypeOptions[] = licenseTypeLabels.map(
  (obj) => ({
    ...obj,
    disabled: false,
  })
);

interface LicenseTypeOptions extends LicenseTypeLabel {
  disabled: boolean;
}
