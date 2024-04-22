import { EventHandler } from '@net7/core';
import { MrMetadataDynamicDS } from '../data-sources';

export class MrMetadataDynamicEH extends EventHandler {
  dataSource: MrMetadataDynamicDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'metadata-contenuti.click':
          this.dataSource.toggleGroup(payload);
          break;
        default:
          break;
      }
    });
  }
}
