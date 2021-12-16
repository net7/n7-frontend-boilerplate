import { EventHandler } from '@n7-frontend/core';
import { FacetHistogramDS } from '../../data-sources/facets/facet-histogram.ds';

export class FacetHistogramEH extends EventHandler {
  dataSource: FacetHistogramDS

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          console.log('triggered change in histogram facet');
          if (payload) {
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
