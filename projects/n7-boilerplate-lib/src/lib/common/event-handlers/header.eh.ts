import { EventHandler } from '@n7-frontend/core';

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

        default:
          break;
      }
    });
  }
}
