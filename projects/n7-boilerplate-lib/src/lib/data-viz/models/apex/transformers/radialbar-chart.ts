import { ChartData } from '@n7-frontend/components';
import { merge } from 'lodash';
import apexHelpers from '../apex-helpers';
import { ChartResponseData } from '../../../types/response.types';

export default {
  run: (id: string, data: ChartResponseData, options?: any): ChartData => ({
    containerId: apexHelpers.getContainerId(id),
    libOptions: merge({
      chart: {
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
        }
      },
      series: apexHelpers.getSeries(data.series)[0].data,
      labels: data.categories,
      metadata: {
        series: apexHelpers.getSeriesMetadata(data.series),
      },
    }, options)
  })
};
