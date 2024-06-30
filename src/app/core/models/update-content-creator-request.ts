import { BaseUpdateUserRequest } from './base-update-user-request';

export interface UpdateContentCreatorRequest extends BaseUpdateUserRequest {
  nip?: number;
  phoneNumber?: number;
}
