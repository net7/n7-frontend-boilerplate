import { EventHandler } from '@net7/core';

export class MrSearchPageDescriptionEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-page-description.click':
          this.emitOuter('click', payload);
          break;
        default:
          break;
      }
    });
  }
}
