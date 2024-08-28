import { BaseRegistrationRequest } from '../../../core/models/requests/base-registration-request';

export interface RegistrationContentCreatorRequest
  extends BaseRegistrationRequest {
  nip: string;
  phoneNumber: string;
}
