import { DataSource } from '@n7-frontend/core';

export class SbDummyDS extends DataSource {
  protected transform(data: any): any {
    return data;
  }
}
