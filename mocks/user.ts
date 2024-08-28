import { Role } from '../src/app/core/models/enums/roles.enum';
import { User } from '../src/app/core/models/classes/user';

export const user: User = {
  id: '12312323',
  userName: 'user1',
  email: 'user1@gmail.com',
  role: Role.EndUser,
  // movies: [
  //   {
  //     id: '1',
  //     userId: '12321',
  //     title: 'The Shawshank Redemption',
  //     imageUrl: './../../../../assets/images/obraz.jpg',
  //     description: 'Lorem ipsum',
  //     comments: [],
  //   },
  //   {
  //     id: '2',
  //     userId: '12321',
  //     title: 'The Godfather',
  //     imageUrl: './../../../../assets/images/obraz.jpg',
  //     description: 'Lorem ipsum',
  //     comments: [],
  //   },
  // ],
};
