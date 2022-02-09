import { DataWidgetData } from '@net7/components';
import { DataSource } from '@net7/core';

export class DataWidgetItemDS extends DataSource {
  protected transform(data: DataWidgetData): DataWidgetData {
    return data;
  }
}
