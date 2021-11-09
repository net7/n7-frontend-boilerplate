import { EventHandler } from '@n7-frontend/core';
import { FacetMapDS } from '../../data-sources/facets/facet-map.ds';

export class FacetMapEH extends EventHandler {
  dataSource: FacetMapDS;

  isMultiple: boolean;

  public listen() {
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        case 'mr-search-facets-layout.facetloaded':
          // Listen for incoming marker events
          this.dataSource.markerEvents$.subscribe((event) => {
            switch (event.type) {
              // trigger search facet logic
              case 'marker.click': {
                // detect "multiple: true | false" in config > facet > schema
                // and apply the correct logic.
                const { isMultiple } = this.dataSource.options;
                if (isMultiple) {
                  this.dataSource.toggleValue(event.id);
                } else {
                  this.dataSource.setValue([event.id]);
                }
                // (make request and update component)
                this.emitOuter('change', {
                  value: this.dataSource.getValue(),
                  id: this.dataSource.id
                });
              } break;
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
