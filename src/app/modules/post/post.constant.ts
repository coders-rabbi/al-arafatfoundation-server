export interface IMonthlyPostCount {
  month: string;
  count: number;
}

export interface IMonthlyPostCountResponse {
  year: number;
  data: IMonthlyPostCount[];
}
