import { EventHandler } from '@net7/core';

export class MrYearHeaderEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type }) => {
      switch (type) {
        case 'mr-year-header.click':
          this.emitOuter('closeevent');
          break;
        default:
          break;
      }
    });
  }
}
