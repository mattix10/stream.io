import { User } from '../classes/user';
import { Response } from './response';

export type UserListResponse = Response<UserList>;

interface UserList {
  users: User[];
}
