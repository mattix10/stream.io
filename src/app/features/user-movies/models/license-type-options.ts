import { licenseTypeLabels } from './license-type-labels';

export const licenseTypeOptions = licenseTypeLabels.map((obj) => ({
  ...obj,
  disabled: false,
}));
