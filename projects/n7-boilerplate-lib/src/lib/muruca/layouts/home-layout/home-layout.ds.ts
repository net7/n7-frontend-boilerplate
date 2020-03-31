import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';

export class MrHomeLayoutDS extends LayoutDataSource {
  onInit() {
    this.one('mr-resources').updateOptions({ source: 'resources' });
    this.one('mr-collections').updateOptions({ source: 'collections' });
    this.some(['mr-resources', 'mr-collections']).update({});
  }
}
