import { MovieComment } from './movie-comment';
import { MovieMetadata } from './movie-item';

export interface Movie extends MovieMetadata {
  description: string;
  userId: string;
  comments: MovieComment[];
  fileImageName?: string;
  fileMovieName?: string;
}

export interface MovieRequest extends MovieMetadata {
  description: string;
  userId: string;
  comments?: MovieComment[];
  fileImageName?: string;
  fileMovieName?: string;
}
