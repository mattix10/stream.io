import { Role } from '../enums/roles.enum';

export interface Token {
  sub: string;
  name: string;
  role: Role;
  email: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}
