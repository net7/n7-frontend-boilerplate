import { ChartResponseData } from '@n7-frontend/boilerplate';
import { ChartData } from '@n7-frontend/components';
import { merge } from 'lodash';
import apexHelpers from '../apex-helpers';

export default {
  run: (id: string, data: ChartResponseData, options?: any): ChartData => ({
    containerId: apexHelpers.getContainerId(id),
    libOptions: merge({
      chart: {
        type: 'pie',
      },
      series: apexHelpers.getSeries(data.series)[0].data,
      labels: data.categories
    }, options)
  })
};
