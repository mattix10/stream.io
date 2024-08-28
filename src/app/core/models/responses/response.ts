export interface Response<T> {
  message: string;
  result: T;
  isSuccess?: boolean;
}
