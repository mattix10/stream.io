export interface LicenseRule {
  price: number;
  type: LicenseType;
  duration: LicenseDuration;
}

export enum LicenseType {
  Buy = 1,
  Rent,
}

export enum LicenseDuration {
  Day = 1,
  TwoDays,
  ThreeDays,
  Week,
  Month,
}

export const licenseTypeValueLabels = [
  { value: LicenseType.Buy, label: 'Kupno' },
  { value: LicenseType.Rent, label: 'Wypożyczenie' },
];

export const licenseDurationLabels = [
  { value: LicenseDuration.Day, label: 'Dzień' },
  { value: LicenseDuration.TwoDays, label: 'Dwa dni' },
  { value: LicenseDuration.ThreeDays, label: 'Trzy dni' },
  { value: LicenseDuration.Week, label: 'Tydzień' },
  { value: LicenseDuration.Month, label: 'Miesiąc' },
];

export const licenseTypeOptions = licenseTypeValueLabels.map((obj) => ({
  ...obj,
  disabled: false,
}));

export const licenseDurationOptions = licenseDurationLabels.map((obj) => ({
  ...obj,
  disabled: false,
}));

export type DurationLabel = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
};
