import { BaseRegistrationRequest } from './base-registration-request';

export interface RegistrationContentCreatorRequest
  extends BaseRegistrationRequest {
  nip: number;
  phoneNumber: number;
}
