import { DataSource } from '@n7-frontend/core';

export class MrItemPreviewDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    return data;
  }
}
