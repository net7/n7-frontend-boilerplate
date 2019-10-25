import { EventHandler } from '@n7-frontend/core';

export class AwSearchLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-search-layout.init':
          this.dataSource.onInit(payload);
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        // TODO
        default:
          break;
      }
    });
  }
}