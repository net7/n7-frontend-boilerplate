import { DataSource } from '@n7-frontend/core';

export class FooterDS extends DataSource {
  protected transform(data) {
    if(!data) {
      return;
    }
    return data.items;
  }
}
