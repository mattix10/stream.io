import { BaseRegistrationRequest } from 'src/app/features/auth/models/base-registration-request';
import { password } from './user-registration';

export const adminRegistration: BaseRegistrationRequest = {
  email: 'admin@admin.com',
  password,
  username: 'admin',
};
