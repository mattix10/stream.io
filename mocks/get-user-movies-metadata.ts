import { UserMoviesMetadataResponse } from 'src/app/core/models/user-movies-metadata';

export const getUserMoviesMetadataResponse: UserMoviesMetadataResponse[] = [
  {
    uuid: '123',
    title: 'title',
    description: 'description',
    imageStatus: 0,
    movieStatus: 0,
    licenseRules: [
      {
        price: 0,
        type: 1,
        duration: 1,
      },
    ],
  },
];
