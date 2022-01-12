import { EventHandler } from '@n7-frontend/core';

export class CardEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      // redirect signal
      this.emitOuter(type.replace(`${this.hostId}.`, ''), payload);
    });
  }
}
