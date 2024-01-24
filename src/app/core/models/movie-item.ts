export interface MovieItem {
  id: string;
  imgUrl: string;
  title: string;
  category: MovieCategory;
}

export enum MovieCategory {
  Series,
  Movie,
}
