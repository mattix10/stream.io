import { Movie } from './movie';

export interface User {
  id: string;
  role: string;
  email: string;
  username: string;
  movies: Movie[];
}
