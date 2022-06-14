import { EventHandler } from '@net7/core';

export class FooterEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      // redirect event
      this.emitOuter(type.replace(`${this.hostId}.`, ''), payload);
    });
  }
}
