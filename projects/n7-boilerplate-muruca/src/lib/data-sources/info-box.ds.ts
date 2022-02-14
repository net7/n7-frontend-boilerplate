import { DataSource } from '@net7/core';

export class MrInfoBoxDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    return data;
  }
}
