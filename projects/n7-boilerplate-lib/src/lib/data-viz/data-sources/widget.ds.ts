import { DataSource } from '@n7-frontend/core';
import { DATA_WIDGET_MOCK } from '@n7-frontend/components';

export class DvWidgetDS extends DataSource {
  protected transform() {
    return DATA_WIDGET_MOCK;
  }
}
