import { EventHandler } from '@net7/core';
import { MrGalleryDS } from '../data-sources';

export class MrGalleryEH extends EventHandler {
  public dataSource: MrGalleryDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.click`:
        case 'mr-gallery.click':
          this.dataSource.setSelected(payload);
          break;
        case `${this.dataSource.id}.close`:
        case 'mr-gallery.close':
          this.dataSource.removeSelected();
          break;
        default:
          break;
      }
    });
  }
}
