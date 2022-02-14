import { EventHandler } from '@net7/core';

export class MrGlossaryLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-glossary-layout.init':
          this.dataSource.onInit(payload);
          // scroll top
          window.scrollTo(0, 0);
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }
}
