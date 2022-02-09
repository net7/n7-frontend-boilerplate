/* eslint-disable */
import { EventHandler } from '@net7/core';

export class DvExampleLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      this.dataSource.onInit();
    });
  }
}
