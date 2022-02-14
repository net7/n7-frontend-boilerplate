import { EventHandler } from '@net7/core';

export class MrCollectionEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.click`: {
          const { action } = payload;
          if (action === 'resource-modal') {
            this.emitOuter('openresourcemodal', payload);
          }
          break;
        }
        default:
          break;
      }
    });
  }
}
