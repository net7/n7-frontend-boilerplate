import { DataSource } from '@n7-frontend/core';

export class HeaderDS extends DataSource {
  protected transform(data) {
    return data;
  }
}
