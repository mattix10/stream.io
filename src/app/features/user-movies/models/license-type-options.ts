import { licenseTypeValueLabels } from './license-type-value-labels';

export const licenseTypeOptions = licenseTypeValueLabels.map((obj) => ({
  ...obj,
  disabled: false,
}));
