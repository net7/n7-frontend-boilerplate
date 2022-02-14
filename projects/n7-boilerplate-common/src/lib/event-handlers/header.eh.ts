import { EventHandler } from '@net7/core';

export class HeaderEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'header.click':
          this.dataSource.onClick(payload);
          break;

        default:
          break;
      }
    });
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'main-layout.currentnavchange':
          this.dataSource.onCurrentNavChange(payload);
          break;

        case 'main-layout.routerchange':
          this.dataSource.onRouterChange();
          break;

        default:
          break;
      }
    });
  }
}
