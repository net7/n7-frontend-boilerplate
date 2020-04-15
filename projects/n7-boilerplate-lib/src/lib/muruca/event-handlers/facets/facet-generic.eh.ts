import { EventHandler } from '@n7-frontend/core';

export class FacetGenericEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'change':
          // TODO: lanciare evento
          console.warn('TODO: event', this.dataSource.id, payload);
          break;
        default:
          break;
      }
    });
  }
}
