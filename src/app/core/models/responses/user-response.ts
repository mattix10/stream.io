import { User } from '../user';

export interface UserResponse {
  user: User;
  token: string;
}
