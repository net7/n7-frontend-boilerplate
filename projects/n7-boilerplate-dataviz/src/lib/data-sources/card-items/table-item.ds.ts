import { TableData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class TableItemDS extends DataSource {
  protected transform(data: TableData): TableData {
    return data;
  }
}
