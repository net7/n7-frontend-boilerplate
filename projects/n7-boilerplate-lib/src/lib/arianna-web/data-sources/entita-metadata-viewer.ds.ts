import { DataSource } from '@n7-frontend/core';

export class AwEntitaMetadataViewerDS extends DataSource {
  public hasFields = false;

  protected transform(data) {
    this.hasFields = !!(Array.isArray(data) && data.length);

    return {
      group: [{
        items: data || []
      }]
    };
  }
}
