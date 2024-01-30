import { MovieComment } from './movie-comment';
import { MovieItem } from './movie-item';

export interface Movie extends MovieItem {
  description: string;
  userId: string;
  comments: MovieComment[];
  fileImageName?: string;
  fileMovieName?: string;
}

export interface MovieRequest extends MovieItem {
  description: string;
  userId: string;
  comments?: MovieComment[];
  fileImageName?: string;
  fileMovieName?: string;
}
