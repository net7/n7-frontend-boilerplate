import { EventHandler } from '@n7-frontend/core';

export class FooterEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        default:
          console.warn('unhandled inner event of type', type)
          break;
      }
    });
  }

}
