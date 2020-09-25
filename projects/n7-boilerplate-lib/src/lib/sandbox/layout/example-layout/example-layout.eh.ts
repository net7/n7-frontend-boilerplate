/* eslint-disable */
import { EventHandler } from '@n7-frontend/core';

export class SbExampleLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      this.dataSource.onInit();
    });
  }
}
