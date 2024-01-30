import { Movie } from '../core/models/movie';
import { MovieCategory } from '../core/models/movie-item';

export const movies: Movie[] = [
  {
    id: '1',
    category: MovieCategory.Movie,
    title: 'The Shawshank Redemption',
    imgUrl: './../../../../assets/images/obraz.jpg',
    userId: '1',
    description: 'test description',
    comments: [],
  },
];
