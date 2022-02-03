import { EventHandler } from '@n7-frontend/core';

export class MrSearchResultsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-results.click': {
          const { action } = payload;
          if (action === 'resource-modal') {
            this.emitOuter('openresourcemodal', payload);
          }
          break;
        }
        default:
          break;
      }
    });
  }
}
