import { EventHandler } from '@n7-frontend/core';

export class MrSearchTagsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-tags.click':
          this.emitOuter('click', payload);
          break;
        default:
          break;
      }
    });
  }
}
