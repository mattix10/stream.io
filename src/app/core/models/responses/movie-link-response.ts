export interface MovieLinkResponse {
  result: MovieLinkResult;
  message: string;
}

interface MovieLinkResult {
  url: string;
}
