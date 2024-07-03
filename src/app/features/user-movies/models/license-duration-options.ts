import { licenseDurationLabels } from './license-duration-labels';

export const licenseDurationOptions = licenseDurationLabels.map((obj) => ({
  ...obj,
  disabled: false,
}));
