import { EventHandler } from '@n7-frontend/core';

export class SbImageViewerToolsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-tools.click':
          console.log('This', payload);
          if (payload === 'close-description') {
            this.dataSource.toggleDescription();
          }
          if (payload === 'toggle-description') {
            this.dataSource.toggleDescription();
          }
          if (payload === 'toggle-thumbs') {
            this.dataSource.toggleThumbs();
          }
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });

    // this.outerEvents$.subscribe(({ type, payload }) => {
    //   switch (type) {
    //     default:
    //       console.warn('unhandled event of type', type);
    //       break;
    //   }
    // });
  }
}
