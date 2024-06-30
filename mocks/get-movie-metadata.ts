import { MovieMetadata } from 'src/app/core/models/movie-metadata';

export const getMovieMetadata: MovieMetadata = {
  uuid: 'string',
  title: 'string',
  duration: 0,
  description: 'string',
  licenseRules: [
    {
      price: 1,
      type: 0,
      duration: 0,
    },
  ],
  comments: [
    {
      body: 'string',
      userName: 'string',
      creationTime: 'y/m/d-h:m:s',
    },
  ],
  imageUrl: 'string',
};
