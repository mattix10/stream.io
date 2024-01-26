import { Movie } from './movie';

export interface User {
  id: string;
  movies: Movie[];
}
