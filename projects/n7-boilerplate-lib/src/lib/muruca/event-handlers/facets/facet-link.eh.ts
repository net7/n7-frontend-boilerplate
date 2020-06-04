import { EventHandler } from '@n7-frontend/core';

export class FacetLinkEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          this.dataSource.toggleValue(payload);
          this.emitOuter('change', {
            value: this.dataSource.getValue(),
            id: this.dataSource.id
          });
          break;
        default:
          break;
      }
    });
  }
}
