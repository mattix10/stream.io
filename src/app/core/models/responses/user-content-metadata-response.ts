import { UserContentMetadata } from '../interfaces/user-content-metadata';
import { Response } from './response';

export type UserContentMetadataResponse = Response<UserContentMetadataResult>;

interface UserContentMetadataResult {
  contentCreatorContents: UserContentMetadata[];
  count: number;
}
