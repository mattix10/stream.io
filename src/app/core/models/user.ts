import { Role } from './roles.enum';

export class User {
  id: string = '';
  email: string = '';
  role: Role | string = '';
  userName: string = '';
  phoneNumber?: string;
  nip?: string;

  constructor(
    id: string = '',
    role: Role | string = '',
    email: string = '',
    userName: string = '',
    phoneNumber?: string,
    nip?: string
  ) {
    this.id = id;
    this.role = role;
    this.email = email;
    this.userName = userName;
    this.phoneNumber = phoneNumber;
    this.nip = nip;
  }
}
