export interface Response<T> {
  isSuccess: boolean;
  message: string;
  result: T;
}
