import { User } from '../classes/user';
import { Response } from './response';

export type UserResponse = Response<UserAuthData>;

interface UserAuthData {
  user: User;
  token: string;
}
