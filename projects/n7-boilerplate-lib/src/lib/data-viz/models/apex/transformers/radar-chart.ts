import { ChartData } from '@n7-frontend/components';
import { merge } from 'lodash';
import apexHelpers from '../apex-helpers';
import { ChartResponseData } from '../../../types/response.types';

export default {
  run: (id: string, data: ChartResponseData, options?: any): ChartData => ({
    containerId: apexHelpers.getContainerId(id),
    libOptions: merge({
      chart: {
        type: 'radar',
      },
      series: apexHelpers.getSeries(data.series),
      xaxis: {
        categories: data.categories,
      }
    }, options)
  })
};
