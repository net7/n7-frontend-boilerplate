import { DataSource } from '@net7/core';

export class MrContentDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    return data;
  }
}
