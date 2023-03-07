/* eslint-disable */
import { EventHandler } from '@net7/core';

export class DvExampleLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'dv-example-layout.init') {
        this.dataSource.onInit(payload);
      }
    });
  }
}
