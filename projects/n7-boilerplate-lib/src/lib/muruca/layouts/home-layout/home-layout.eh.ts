import { EventHandler } from '@n7-frontend/core';

export class MrHomeLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-home-layout.init':
          this.dataSource.onInit(payload);
          break;
        default:
          break;
      }
    });
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        default:
          break;
      }
    });
  }
}
