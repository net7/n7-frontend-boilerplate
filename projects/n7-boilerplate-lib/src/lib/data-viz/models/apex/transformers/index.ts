import { ChartData } from '@n7-frontend/components';
import { ChartResponseData } from '../../../types/response.types';
import barChart from './bar-chart';
import lineChart from './line-chart';
import pieChart from './pie-chart';

const transformers: {
  [id: string]: {
    run: (id: string, data: ChartResponseData, options?: any) => ChartData;
  };
} = {
  'apex-pie-chart': pieChart,
  'apex-line-chart': lineChart,
  'apex-bar-chart': barChart
};

export default transformers;
