import { UserContentMetadataResponse } from 'src/app/core/models/user-content-metadata-response';

export const getUserMoviesMetadataResponse: UserContentMetadataResponse = {
  result: [
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
  ],
};
