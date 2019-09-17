import { DataSource } from '@n7-frontend/core';
import { BUBBLECHART_MOCK } from '@n7-frontend/components';

export class AwHomeBubbleChartDS extends DataSource {

  protected transform(data){
    console.log({data});

    return BUBBLECHART_MOCK;
  }
}