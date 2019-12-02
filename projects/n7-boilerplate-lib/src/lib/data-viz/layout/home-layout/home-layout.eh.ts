import { EventHandler } from '@n7-frontend/core';

export class DvHomeLayoutEH extends EventHandler {

  public listen() {
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'dv-nav.navclick':
          this.dataSource.navSelected = payload;
          break;
        default:
          break;
      }
    })
  }

}