import { User } from '../classes/user';
import { Response } from './response';

export type UserAuthDataResponse = Response<UserAuthData>;

interface UserAuthData {
  user: User;
  token: string;
}
