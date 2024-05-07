import { Movie } from './movie';

export interface User {
  id: string;
  roles: string[];
  email: string;
  username: string;
  movies: Movie[];
  phoneNumber?: string;
}
