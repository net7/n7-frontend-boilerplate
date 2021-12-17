import { ChartData } from '@n7-frontend/components';
import { ChartResponseData } from '../../../types/response.types';
import pieChart from './pie-chart';

const transformers: {
  [id: string]: {
    run: (id: string, data: ChartResponseData, options?: any) => ChartData;
  };
} = {
  'pie-chart': pieChart
};

export default transformers;
