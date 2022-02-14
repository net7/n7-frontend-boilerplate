import { DataSource } from '@net7/core';

export class MrTextViewerDS extends DataSource {
  id: string;

  protected transform(data: any): any {
    return data;
  }
}
