import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';

export class MrHomeLayoutDS extends LayoutDataSource {
  onInit() {
    this.one('mr-dummy').update('world!');
  }
}
