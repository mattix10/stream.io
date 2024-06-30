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

export const licenseTypeOptions = [
  { value: LicenseType.Buy, label: 'Kupno', disabled: false },
  { value: LicenseType.Rent, label: 'Wypożyczenie', disabled: false },
];

export const licenseDurationOptions = [
  { value: LicenseDuration.Day, label: 'Dzień' },
  { value: LicenseDuration.TwoDays, label: 'Dwa dni' },
  { value: LicenseDuration.ThreeDays, label: 'Trzy dni' },
  { value: LicenseDuration.Week, label: 'Tydzień' },
  { value: LicenseDuration.Month, label: 'Miesiąc' },
].map((obj) => ({ ...obj, disabled: false }));

export type DurationLabel = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
};
