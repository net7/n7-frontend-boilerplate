import { DataSource } from '@n7-frontend/core';

export class TextItemDS extends DataSource {
  protected transform(data: string): string {
    return data;
  }
}
