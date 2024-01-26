import { MovieItem } from './movie-item';

export interface Movie extends MovieItem {
  description: string;
  userId: string;
  fileImageName?: string;
  fileMovieName?: string;
}
