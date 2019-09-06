import { DataSource } from '@n7-frontend/core';

export class HeaderDS extends DataSource {
  protected transform(data) {
    console.log('header', data);
    if(!data) return;

    return data;
  }
}
