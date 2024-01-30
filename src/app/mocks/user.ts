import { MovieCategory } from '../core/models/movie-item';
import { User } from '../core/models/user';

export const user: User = {
  id: '12312323',
  movies: [
    {
      id: '1',
      userId: '12321',
      category: MovieCategory.Movie,
      title: 'The Shawshank Redemption',
      imgUrl: './../../../../assets/images/obraz.jpg',
      description: 'Lorem ipsum',
      comments: [],
    },
    {
      id: '2',
      userId: '12321',
      category: MovieCategory.Series,
      title: 'The Godfather',
      imgUrl: './../../../../assets/images/obraz.jpg',
      description: 'Lorem ipsum',
      comments: [],
    },
  ],
};
