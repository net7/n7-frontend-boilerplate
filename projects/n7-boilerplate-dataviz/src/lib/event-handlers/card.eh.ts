import { EventHandler } from '@net7/core';

export class CardEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      // redirect signal
      this.emitOuter(type.replace(`${this.hostId}.`, ''), payload);
    });
  }
}
