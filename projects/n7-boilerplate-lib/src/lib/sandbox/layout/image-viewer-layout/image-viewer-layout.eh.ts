/* eslint-disable */
import { EventHandler } from '@n7-frontend/core';

export class SbImageViewerLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-layout.init':
          this.dataSource.onInit(payload);
          this.emitOuter('init');
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-tools.click':
          // Silent
          break;
        case 'sb-image-viewer.pagechange':
          this.emitOuter('pagechange', payload);
          break;
        case 'sb-image-viewer-tools.thumbclick':
          this.emitOuter('thumbclick', payload);
          break;
        case 'sb-image-viewer.click':
          this.emitOuter('viewerclick', payload);
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
