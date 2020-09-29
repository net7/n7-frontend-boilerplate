/* eslint-disable */
import { EventHandler } from '@n7-frontend/core';

export class SbImageViewerLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-image-viewer-tools.click':
          console.log('click', type, payload);
          console.log(this);
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
