import { ChartData } from '@n7-frontend/components';
import transformers from './transformers';

export class ApexHandler {
  transform({
    id, type, data, options
  }): ChartData {
    if (!transformers[type]) {
      throw Error(`Apex transformer ${type} does not exists`);
    }
    return transformers[type].run(id, data, options);
  }
}

// exports
export const apexHandler = new ApexHandler();
