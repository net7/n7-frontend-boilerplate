/* eslint-disable */
import { EventHandler } from '@n7-frontend/core';

export class SbExampleLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-example-layout.init':
          console.log('layout-inner', type, payload);
          this.emitOuter('init', payload);
          this.dataSource.onInit();
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-dummy.click':
          console.log('layout-outer', type, payload);
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
