import { LicenseType } from 'src/app/core/models/enums/license-type.enum';

export const licenseTypeLabels: LicenseTypeLabel[] = [
  { value: LicenseType.Buy, label: 'Kupno' },
  { value: LicenseType.Rent, label: 'Wypożyczenie' },
];

export interface LicenseTypeLabel {
  value: LicenseType;
  label: string;
}
