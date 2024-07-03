import { LicenseDuration, LicenseType } from 'src/app/core/models/license-rule';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';

export const getMovieMetadata: MovieMetadata = {
  uuid: 'string',
  title: 'string',
  duration: 0,
  description: 'string',
  licenseRules: [
    {
      price: 1,
      type: LicenseType.Buy,
      duration: LicenseDuration.Month,
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
