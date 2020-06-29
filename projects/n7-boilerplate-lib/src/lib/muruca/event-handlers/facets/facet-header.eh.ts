import { EventHandler } from '@n7-frontend/core';

export class FacetHeaderEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type }) => {
      switch (type) {
        case `${this.dataSource.id}.click`:
          this.dataSource.toggle();
          this.emitOuter('change', {
            isOpen: this.dataSource.isOpen(),
            id: this.dataSource.id,
            value: this.dataSource.value
          });
          break;
        default:
          break;
      }
    });
  }
}
