import { EventHandler } from '@net7/core';

export class MrButtonEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.click`:
          this.emitOuter('download-pdf', payload);
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
