import { DataSource } from '@net7/core';

export class AwSchedaMetadataDS extends DataSource {
  protected transform(data) {
    return {
      group: [{
        items: data || []
      }]
    };
  }
}
