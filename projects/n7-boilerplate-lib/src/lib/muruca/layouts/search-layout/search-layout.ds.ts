import { LayoutDataSource } from '@n7-frontend/core';
import facetsConfig from './search-facets.config';

export class MrSearchLayoutDS extends LayoutDataSource {
  public facetsConfig;

  onInit() {
    this.facetsConfig = facetsConfig;

    this.one('mr-resources').updateOptions({ source: 'search' });
    this.one('mr-resources').update({});
  }
}
