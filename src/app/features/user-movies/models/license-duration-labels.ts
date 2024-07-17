import { LicenseDuration } from 'src/app/core/models/license-duration.enum';

export const licenseDurationLabels = [
  { value: LicenseDuration.OneDay, label: 'Dzień' },
  { value: LicenseDuration.TwoDays, label: 'Dwa dni' },
  { value: LicenseDuration.ThreeDays, label: 'Trzy dni' },
  { value: LicenseDuration.Week, label: 'Tydzień' },
  { value: LicenseDuration.Month, label: 'Miesiąc' },
];
