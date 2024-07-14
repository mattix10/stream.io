import { AllMoviesMetadataResponse } from 'src/app/core/models/responses/all-movies-metadata-response';

export const getAllMoviesMetadata: AllMoviesMetadataResponse = {
  contents: [
    {
      uuid: 'string',
      title: 'string',
      duration: 10,
      imageUrl: './../../../../assets/images/django.jpg',
    },
  ],
  count: 0,
};
