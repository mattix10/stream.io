import { RegistrationContentCreatorRequest } from 'src/app/features/auth/models/registration-content-creator-request';
import { password } from './user-registration';

export const contentCreatorRegistration: RegistrationContentCreatorRequest = {
  email: 'company1@company1.com',
  password,
  nip: '1234567890',
  phoneNumber: '123456789',
  username: 'company1',
};
