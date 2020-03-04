import { DataSource } from '@n7-frontend/core';

export class FooterDS extends DataSource {
  protected transform(data): any {
    if (!data) {
      return null;
    }
    return data.items;
  }
}
