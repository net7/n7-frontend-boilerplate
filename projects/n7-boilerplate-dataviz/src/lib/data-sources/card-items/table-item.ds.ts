import { TableData } from '@net7/components';
import { DataSource } from '@net7/core';

export class TableItemDS extends DataSource {
  protected transform(data: TableData): TableData {
    return data;
  }
}
