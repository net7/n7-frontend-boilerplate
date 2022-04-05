import { DataSource } from '@net7/core';
import { DATA_WIDGET_MOCK } from '@net7/components';

export class DvWidgetDS extends DataSource {
  protected transform() {
    return DATA_WIDGET_MOCK;
  }
}
