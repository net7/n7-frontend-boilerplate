import { isObject } from 'lodash';
import { ChartResponseSeries } from '../../types/response.types';

const getSeries = (
  series: ChartResponseSeries[]
): ApexAxisChartSeries => series.map(({ id, name, data }) => ({
  id,
  name,
  data: data.map((point) => (isObject(point) ? point.value : point))
}));

const getSeriesMetadata = (
  series: ChartResponseSeries[]
): object[] => series.map(({ data }) => {
  const serieMetadata = [];
  data.forEach((point) => {
    if (isObject(point)) {
      serieMetadata.push(point?.metadata || null);
    } else {
      serieMetadata.push(null);
    }
  });
  return serieMetadata;
});

export default {
  getContainerId: (id: string) => `chart-${id}`,
  getSeries,
  getSeriesMetadata
};
