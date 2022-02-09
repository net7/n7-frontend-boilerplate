import { EventHandler } from '@net7/core';

export class DvCardExampleLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      console.log('innerEvents$----->', type, payload);
      switch (type) {
        case 'dv-card-example-layout.init':
          this.dataSource.onInit(payload);
          break;
        case 'dv-card-example-layout.destroy':
          this.dataSource.onDestroy();
          break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      console.log('outerEvents$----->', type, payload);
      // TODO
    });
  }
}
