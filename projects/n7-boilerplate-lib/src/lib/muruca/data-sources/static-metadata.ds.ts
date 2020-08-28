import { DataSource } from '@n7-frontend/core';

export class MrStaticMetadataDS extends DataSource {
  protected transform(data: any): any {
    const items = ['authors', 'date', 'time_to_read']
      .filter((key) => data[key])
      .map((key) => ({
        value: data[key]
      }));

    return { group: [{ items }] };
  }
}
