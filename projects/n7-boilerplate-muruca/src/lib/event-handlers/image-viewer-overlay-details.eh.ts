import { EventHandler } from '@net7/core';
import { MrImageViewerOverlayDetailsDS } from '../data-sources/image-viewer-overlay-details.ds';

export class MrImageViewerOverlayDetailsEH extends EventHandler {
  dataSource: MrImageViewerOverlayDetailsDS;

  public listen() {
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.hideoverlaydetails':
        case 'mr-resource-layout.overlaycloseclick':
          this.dataSource.hide();
          break;
        case 'mr-resource-layout.showoverlaydetails': {
          const target = `${payload.targetId}-overlay-details`;
          if (target === this.dataSource.id) {
            this.dataSource.show(payload);
          }
        } break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
