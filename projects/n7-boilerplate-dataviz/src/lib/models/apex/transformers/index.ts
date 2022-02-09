import { ChartData } from '@net7/components';
import { ChartResponseData } from '../../../types/response.types';
import barChart from './bar-chart';
import lineChart from './line-chart';
import pieChart from './pie-chart';
import radarChart from './radar-chart';
import radialbarChart from './radialbar-chart';

const transformers: {
  [id: string]: {
    run: (id: string, data: ChartResponseData, options?: any) => ChartData;
  };
} = {
  'apex-pie-chart': pieChart,
  'apex-line-chart': lineChart,
  'apex-bar-chart': barChart,
  'apex-radialbar-chart': radialbarChart,
  'apex-radar-chart': radarChart
};

export default transformers;
