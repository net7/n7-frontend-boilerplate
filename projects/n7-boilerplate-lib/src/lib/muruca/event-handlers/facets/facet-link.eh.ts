import { EventHandler } from '@n7-frontend/core';
import { FacetLinkDS } from 'dist/n7-boilerplate-lib/lib/muruca/data-sources/facets/facet-link.ds';

export class FacetLinkEH extends EventHandler {
  dataSource: FacetLinkDS

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          if (payload) {
            this.dataSource.toggleValue(payload);
            this.emitOuter('change', {
              value: this.dataSource.getValue(),
              id: this.dataSource.id
            });
          }
          break;
        default:
          break;
      }
    });
  }
}
