import { EventHandler } from '@n7-frontend/core';

export class MrSearchResultsTitleEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-results-title.change':
          this.emitOuter('change', payload);
          break;
        default:
          break;
      }
    });
  }
}
