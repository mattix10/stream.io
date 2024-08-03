import { BaseRegistrationRequest } from './base-registration-request';

export interface RegistrationContentCreatorRequest
  extends BaseRegistrationRequest {
  nip: string;
  phoneNumber: string;
}
