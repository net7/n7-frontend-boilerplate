import { ChartData } from '@net7/components';
import { DataSource } from '@net7/core';
import { apexHandler } from '../../models/apex/apex-handler';
import { ChartResponseData } from '../../types/response.types';

export class ApexChartItemDS extends DataSource {
  id: string;

  type: string;

  instance: any;

  protected transform(data: ChartData): ChartData {
    return data;
  }

  update(newData: ChartResponseData) {
    const formattedData = apexHandler.transform({
      data: newData,
      id: this.id,
      type: this.type,
      options: this.options,
    });
    if (this.instance) {
      // lib api update
      this.instance.updateOptions(formattedData.libOptions);
    } else {
      formattedData.setChart = (chart) => {
        this.instance = chart;
      };
      this.run(formattedData);
    }
  }
}
