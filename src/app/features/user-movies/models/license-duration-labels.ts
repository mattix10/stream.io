import { LicenseDuration } from 'src/app/core/models/enums/license-duration.enum';

export const licenseDurationLabels: LicenseDurationLabel[] = [
  { value: LicenseDuration.OneDay, label: 'Dzień' },
  { value: LicenseDuration.TwoDays, label: 'Dwa dni' },
  { value: LicenseDuration.ThreeDays, label: 'Trzy dni' },
  { value: LicenseDuration.Week, label: 'Tydzień' },
  { value: LicenseDuration.Month, label: 'Miesiąc' },
];

export interface LicenseDurationLabel {
  value: LicenseDuration;
  label: string;
}
