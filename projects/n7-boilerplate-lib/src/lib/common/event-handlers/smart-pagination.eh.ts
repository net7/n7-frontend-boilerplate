import { EventHandler } from '@n7-frontend/core';

export class SmartPaginationEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'n7-smart-pagination.change':
          this.emitOuter('change', payload);
          break;

        case 'n7-smart-pagination.click':
          this.emitOuter('click', payload);
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }
}
