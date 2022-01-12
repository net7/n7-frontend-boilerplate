import { DataWidgetData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class DataWidgetItemDS extends DataSource {
  protected transform(data: DataWidgetData): DataWidgetData {
    return data;
  }
}
