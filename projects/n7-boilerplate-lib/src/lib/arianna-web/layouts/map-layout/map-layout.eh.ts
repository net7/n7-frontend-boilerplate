import { EventHandler } from '@n7-frontend/core';

export class AwMapLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-map-layout.init':
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
