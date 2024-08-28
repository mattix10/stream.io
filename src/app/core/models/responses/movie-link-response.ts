import { Response } from './response';

export type MovieLinkResponse = Response<MovieLinkResult>;

interface MovieLinkResult {
  url: string;
}
