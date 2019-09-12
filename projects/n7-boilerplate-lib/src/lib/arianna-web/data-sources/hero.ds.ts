import { DataSource } from '@n7-frontend/core';
import { HERO_MOCK } from '@n7-frontend/components';

export class AwHeroDS extends DataSource {

  protected transform(data){
    let widgetData = HERO_MOCK;
    if(data && data.title) widgetData.title = data.title;

    return widgetData;
  }
}