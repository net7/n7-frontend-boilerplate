import { EventHandler } from '@net7/core';

export class AwExtendedTreeEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      // redirect event
      this.emitOuter(type.split('.')[1], payload);
    });
  }
}
