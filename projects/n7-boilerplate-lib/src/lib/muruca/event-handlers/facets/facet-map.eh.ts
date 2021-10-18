import { EventHandler } from '@n7-frontend/core';
import { FacetMapDS } from '../../data-sources/facets/facet-map.ds';

export class FacetMapEH extends EventHandler {
  dataSource: FacetMapDS

  public listen() {
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        case 'mr-search-facets-layout.facetloaded':
          // Listen for incoming marker events
          this.dataSource.markerEvents$.subscribe((event) => {
            switch (event.type) {
              case 'marker.click':
                // trigger search facet logic
                // (make request and update component)
                this.dataSource.setValue(event.id);
                this.emitOuter('change', {
                  value: this.dataSource.getValue(),
                  id: this.dataSource.id
                });
                break;
              default:
                break;
            }
          });
          break;
        default:
          break;
      }
    });
  }
}
