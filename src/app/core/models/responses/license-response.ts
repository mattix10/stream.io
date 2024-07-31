import { Response } from '../response';

export type LicenseResponse = Response<License>;

export interface License {
  uuid: string;
  keyData: KeyData;
  startTime: string;
  endTime: string;
}

export interface KeyData {
  key: string;
  iv: string;
}
