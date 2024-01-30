import { Movie } from '../core/models/movie';
import { MovieCategory } from '../core/models/movie-item';

export const movie: Movie = {
  id: '1',
  category: MovieCategory.Movie,
  title: 'Django',
  imgUrl: './../../../../assets/images/django.jpg',
  userId: '1',
  description: 'test description',
  comments: [
    {
      userName: 'user1',
      comment: 'Test comment 1',
    },
    {
      userName: 'user2',
      comment: 'Test comment 2',
    },
    {
      userName: 'user3',
      comment: 'Test comment 3',
    },
    {
      userName: 'user3',
      comment: 'Test comment 3',
    },
    {
      userName: 'user3',
      comment: 'Test comment 3',
    },
    {
      userName: 'user4',
      comment: 'Test comment 3',
    },
    {
      userName: 'user93',
      comment: 'Test comment 3',
    },
    {
      userName: 'user6',
      comment: 'Test comment 3',
    },
    {
      userName: 'user8',
      comment: 'Test comment 3',
    },
  ],
};
