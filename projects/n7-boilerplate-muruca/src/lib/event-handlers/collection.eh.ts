import { EventHandler } from '@n7-frontend/core';

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
