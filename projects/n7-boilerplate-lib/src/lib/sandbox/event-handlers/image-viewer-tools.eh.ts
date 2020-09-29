import { EventHandler } from '@n7-frontend/core';

export class SbImageViewerToolsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-tools.click':
          if (payload.thumbindex !== undefined) {
            const index = payload.thumbindex;
            this.dataSource.handleThumbs(index);
            this.emitOuter('thumbclick', index);
            break;
          }
          if (payload === 'close-description') {
            this.dataSource.toggleDescription();
            break;
          }
          if (payload === 'toggle-description') {
            this.dataSource.toggleDescription();
            break;
          }
          if (payload === 'toggle-thumbs') {
            this.dataSource.toggleThumbs();
            break;
          }
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-layout.viewerclick':
          this.dataSource.handleImageViewer(payload);
          break;
        case 'sb-image-viewer-layout.thumbclick':
          // Silent
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
