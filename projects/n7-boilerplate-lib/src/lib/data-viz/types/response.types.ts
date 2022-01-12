export type ChartResponseData = {
  categories: string[];
  series: ChartResponseSeries[];
}
export type ChartResponseSeries = {
  id: string;
  name: string;
  data: (number | ChartResponseSeriesData)[];
}
export type ChartResponseSeriesData = {
  value: number;
  metadata?: object;
}
