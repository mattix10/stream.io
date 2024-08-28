export interface License {
  uuid: string;
  keyData: KeyData;
  startTime: string;
  endTime: string;
}

interface KeyData {
  key: string;
  iv: string;
}
