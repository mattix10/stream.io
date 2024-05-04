export interface MovieItem {
  id: string;
  imgUrl: string;
  title: string;
  movieUrl?: string;
  category?: MovieCategory;
}

export enum MovieCategory {
  Movie = 'Film',
  Series = 'Serial',
}
