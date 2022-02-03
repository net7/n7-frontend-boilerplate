import { EventHandler } from '@n7-frontend/core';

export class FacetLinkMultipleEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          if (payload) {
            this.dataSource.toggleValue(payload);
            this.emitOuter('change', {
              value: this.dataSource.getValue(),
              id: this.dataSource.id
            });
          }
          break;
        default:
          break;
      }
    });
  }
}
