import { EventHandler } from '@net7/core';

export class MrHomeLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-home-layout.init':
          this.dataSource.onInit(payload);
          // scroll top
          window.scrollTo(0, 0);
          break;
        default:
          break;
      }
    });
    this.outerEvents$.subscribe(({ type, payload }) => {
      if (type.indexOf('hero-search-enter') !== -1) {
        this.dataSource.searchRedirect(type, payload);
      }
    });
  }
}
