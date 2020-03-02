import { EventHandler } from '@n7-frontend/core';

export class AwEntitaNavEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-entita-nav.click':
          this.emitOuter('click', payload);
          break;
        default:
          console.warn('unhandled event type');
          break;
      }
    });
    /*

    this.outerEvents$.subscribe(event => {

    });
    */
  }
}
