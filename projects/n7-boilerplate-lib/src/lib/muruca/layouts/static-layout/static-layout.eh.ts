import { EventHandler } from '@n7-frontend/core';

export class MrStaticLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-static-layout.init':
          this.dataSource.onInit(payload);
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });

    /*
      this.outerEvents$.subscribe(({ type, payload }) => {
      });
    */
  }
}
