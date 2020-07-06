import { EventHandler } from '@n7-frontend/core';

export class MrReadMoreEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'dv-read-more.expand':
          this.emitOuter('expand', payload);
          break;
        default:
          console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
