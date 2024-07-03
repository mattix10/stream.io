import { UserContentMetadataResponse } from 'src/app/core/models/responses/user-content-metadata-response';

export const getUserMoviesMetadataResponse: UserContentMetadataResponse = {
  result: [
    {
      uuid: '123',
      title: 'title',
      description: 'description',
      imageStatus: 0,
      movieStatus: 2,
      licenseRules: [
        {
          price: 0,
          type: 1,
          duration: 1,
        },
        {
          price: 10,
          type: 2,
          duration: 1,
        },
        {
          price: 110,
          type: 2,
          duration: 3,
        },
      ],
    },
  ],
};
