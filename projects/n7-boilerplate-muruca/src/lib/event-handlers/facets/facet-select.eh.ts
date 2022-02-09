import { EventHandler } from '@net7/core';

export class FacetSelectEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          this.dataSource.setValue(payload.value);
          this.emitOuter('change', {
            ...payload,
            id: this.dataSource.id
          });
          break;
        default:
          break;
      }
    });
  }
}
