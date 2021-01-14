import { EventHandler } from '@n7-frontend/core';

export class SbDummyEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-dummy.click':
          console.log('widget-inner', type, payload);
          this.emitOuter('click', payload);
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'sb-example-layout.init':
          console.log('widget-outer', type, payload);
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
