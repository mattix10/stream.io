import { BaseUpdateUserRequest } from './base-update-user-request';

export interface UpdateContentCreatorRequest extends BaseUpdateUserRequest {
  nip?: string;
  phoneNumber?: string;
}
