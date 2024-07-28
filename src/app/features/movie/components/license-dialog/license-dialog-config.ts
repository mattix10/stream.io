import {
  LicenseDialogConfig,
  LicenseDialogConfigDetails,
} from '../../models/license-dialog-config';
import { LicenseDialogType } from '../../models/license-dialog-type';

const renewLicenseConfig: LicenseDialogConfigDetails = {
  title: 'Twoja licencja wygasła!',
  subtitle: "Wybierz licencję i kliknij przycisk 'Odnów', aby ją przedłużyć.",
  buttonTitle: 'Odnów licencję',
};

const buyLicenseConfig: LicenseDialogConfigDetails = {
  title: 'Wybierz licencję',
  subtitle: 'Wybierz jedną z licencji i zatwierdź ją, aby móc oglądać film',
  buttonTitle: 'Zatwierdź',
};

export const dialogConfig: LicenseDialogConfig = {
  [LicenseDialogType.Buy]: buyLicenseConfig,
  [LicenseDialogType.Renew]: renewLicenseConfig,
};
