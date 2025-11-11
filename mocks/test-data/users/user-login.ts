import { LoginRequest } from '@app/core/models/requests/login-request';
import { usersRegistration } from './user-registration';

export const userLogin: LoginRequest[] = [
  {
    email: usersRegistration[0].email,
    password: usersRegistration[0].password,
  },
  {
    email: usersRegistration[1].email,
    password: usersRegistration[1].password,
  },
  {
    email: usersRegistration[2].email,
    password: usersRegistration[2].password,
  },
  // Hacker
  {
    email: usersRegistration[3].email,
    password: usersRegistration[3].password,
  },
];
