import { ChartData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { apexHandler } from '../../models/apex/apex-handler';
import { ChartResponseData } from '../../types/response.types';

export class ChartItemDS extends DataSource {
  id: string;

  type: string;

  private instance: any;

  protected transform(data: ChartResponseData): ChartData {
    return {
      ...apexHandler.transform({
        data,
        id: this.id,
        type: this.type,
        options: this.options,
      }),
      setChart(chart) {
        this.instance = chart;
      }
    };
  }
}
