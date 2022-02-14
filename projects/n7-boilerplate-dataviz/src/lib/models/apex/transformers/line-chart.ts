import { merge } from 'lodash';
import { ChartData } from '@net7/components';
import apexHelpers from '../apex-helpers';
import { ChartResponseData } from '../../../types/response.types';

export default {
  run: (id: string, data: ChartResponseData, options?: any): ChartData => ({
    containerId: apexHelpers.getContainerId(id),
    libOptions: merge({
      chart: {
        type: 'line',
      },
      series: apexHelpers.getSeries(data.series),
      xaxis: {
        categories: data.categories,
      },
      metadata: {
        series: apexHelpers.getSeriesMetadata(data.series),
      },
    }, options)
  })
};
