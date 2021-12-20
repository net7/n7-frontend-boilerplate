import { isObject } from 'lodash';
import { ChartResponseSeries } from '../../types/response.types';

export default {
  getContainerId: (id: string) => `chart-${id}`,
  getSeries: (
    series: ChartResponseSeries[]
  ): ApexAxisChartSeries => series.map(({ name, data }) => ({
    name,
    data: data.map((point) => (isObject(point) ? point.value : point))
  }))
};
