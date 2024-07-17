import { Role } from './roles.enum';

export class User {
  id: string = '';
  email: string = '';
  userLevel: Role | string = '';
  userName: string = '';
  phoneNumber?: string;
  nip?: string;
  isActive?: boolean;

  constructor(
    id: string = '',
    role: Role = Role.Unknown,
    email: string = '',
    userName: string = '',
    phoneNumber?: string,
    nip?: string
  ) {
    this.id = id;
    this.userLevel = role;
    this.email = email;
    this.userName = userName;
    this.phoneNumber = phoneNumber;
    this.nip = nip;
  }
}
