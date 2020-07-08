import { DataSource } from '@n7-frontend/core';

export class MrInfoBoxDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    return data;
  }
}
