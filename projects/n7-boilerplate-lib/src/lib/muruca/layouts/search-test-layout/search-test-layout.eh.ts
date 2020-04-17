import { EventHandler } from '@n7-frontend/core';

export class SearchTestLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-test-layout.init':
          this.dataSource.onInit(payload);
          break;
        default:
          break;
      }
    });

    /* this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        default:
          break;
      }
    }); */
  }
}
