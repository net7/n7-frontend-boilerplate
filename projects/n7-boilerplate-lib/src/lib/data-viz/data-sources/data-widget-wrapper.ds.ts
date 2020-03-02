import { DataSource } from '@n7-frontend/core';

export class DvDataWidgetDS extends DataSource {
  protected transform(data) {
    if (!data) { return null; }
    return null;
  }
}
