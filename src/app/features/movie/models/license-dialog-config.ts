import { LicenseDialogType } from './license-dialog-type';

export interface LicenseDialogConfigDetails {
  title: string;
  subtitle: string;
  buttonTitle: string;
}

export type LicenseDialogConfig = {
  [key in LicenseDialogType]: LicenseDialogConfigDetails;
};
