import { DataSource } from '@n7-frontend/core';

export class AwSchedaMetadataDS extends DataSource {
  protected transform(data) {
    return {
      group: [{
        items: data || []
      }]
    };
  }
}
