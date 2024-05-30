import { Movie } from './movie';
import { Role } from './roles.enum';

export class User {
  id: string = '';
  email: string = '';
  roles: Role[] = [];
  username: string = '';
  movies: Movie[] = [];
  phoneNumber?: string;

  constructor(
    id: string = '',
    roles: Role[] = [],
    email: string = '',
    username: string = '',
    movies: Movie[] = [],
    phoneNumber?: string
  ) {
    this.id = id;
    this.roles = roles;
    this.email = email;
    this.username = username;
    this.movies = movies;
    this.phoneNumber = phoneNumber;
  }
}
