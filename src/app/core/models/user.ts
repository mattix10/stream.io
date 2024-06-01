import { Role } from './roles.enum';

export class User {
  id: string = '';
  email: string = '';
  roles: Role[] = [];
  userName: string = '';
  phoneNumber?: string;

  constructor(
    id: string = '',
    roles: Role[] = [],
    email: string = '',
    userName: string = '',
    phoneNumber?: string
  ) {
    this.id = id;
    this.roles = roles;
    this.email = email;
    this.userName = userName;
    this.phoneNumber = phoneNumber;
  }
}
