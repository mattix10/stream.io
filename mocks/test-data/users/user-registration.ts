import { BaseRegistrationRequest } from 'src/app/core/models/requests/base-registration-request';

export const password = 'P4ssword$';

export const usersRegistration: BaseRegistrationRequest[] = [
  {
    email: 'jan@gmail.com',
    password,
    username: 'janek8',
  },
  {
    email: 'magda2@gmail.com',
    password,
    username: 'magda2',
  },
  {
    email: 'alex@gmail.com',
    password,
    username: 'alex',
  },
  {
    email: 'malicious-user@gmail.com',
    password,
    username: 'malicious-user',
  },
];
