import { DataSource } from '@net7/core';

export class FooterDS extends DataSource {
  protected transform(data): any {
    if (!data) {
      return null;
    }
    return data;
  }
}
