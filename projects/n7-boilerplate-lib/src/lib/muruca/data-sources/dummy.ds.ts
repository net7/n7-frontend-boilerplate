import { DataSource } from '@n7-frontend/core';

export class MrDummyDS extends DataSource {
  protected transform(data: string): string {
    return data;
  }
}
