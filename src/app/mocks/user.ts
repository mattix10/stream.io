import { Role } from '../core/models/roles.enum';
import { User } from '../core/models/user';

export const user: User = {
  id: '12312323',
  userName: 'user1',
  email: 'user1@gmail.com',
  roles: [Role.USER],
  // movies: [
  //   {
  //     id: '1',
  //     userId: '12321',
  //     title: 'The Shawshank Redemption',
  //     imgUrl: './../../../../assets/images/obraz.jpg',
  //     description: 'Lorem ipsum',
  //     comments: [],
  //   },
  //   {
  //     id: '2',
  //     userId: '12321',
  //     title: 'The Godfather',
  //     imgUrl: './../../../../assets/images/obraz.jpg',
  //     description: 'Lorem ipsum',
  //     comments: [],
  //   },
  // ],
};
