export type TErrorSource = {
  path: string | number;
  message: string;
}[];

export type TGenericResponseError = {
  statusCode: number;
  message: string;
  errorSource: TErrorSource;
};
