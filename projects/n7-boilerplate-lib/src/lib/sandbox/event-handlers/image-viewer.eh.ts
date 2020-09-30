import { EventHandler } from '@n7-frontend/core';

export class SbImageViewerEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer.click':
          this.emitOuter('click', payload);
          break;
        case 'sb-image-viewer.pagechange':
          this.emitOuter('pagechange', payload);
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-layout.thumbclick':
          this.dataSource.changePage(payload);
          break;
        case 'sb-image-viewer-layout.pagechange':
          // Silent
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
