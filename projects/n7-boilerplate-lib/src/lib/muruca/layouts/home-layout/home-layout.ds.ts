import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';

export class MrHomeLayoutDS extends LayoutDataSource {
  onInit() {
    this.one('mr-maps').updateOptions({ source: 'maps' });
    this.one('mr-paths').updateOptions({ source: 'paths' });
    this.some(['mr-maps', 'mr-paths']).update({});
  }
}
