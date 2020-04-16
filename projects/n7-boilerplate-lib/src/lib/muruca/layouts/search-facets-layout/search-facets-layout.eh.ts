import { EventHandler } from '@n7-frontend/core';

export class SearchFacetsLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-facets-layout.init':
          this.dataSource.onInit(payload);
          break;

        case 'mr-search-facets-layout.destroy':
          this.dataSource.onDestroy();
          break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      if (type.indexOf('change')) {
        console.warn('#todo', payload);
      }
    });
  }
}
