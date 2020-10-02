import { EventHandler } from '@n7-frontend/core';

export class FacetTextEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          if (typeof payload.value === 'string') {
            payload.value = payload.value.trim();
          }
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
