import { EventHandler } from '@n7-frontend/core';
import { FacetHistogramDS } from '../../data-sources/facets/facet-histogram.ds';

export class FacetHistogramEH extends EventHandler {
  dataSource: FacetHistogramDS

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.rangeselected`:
          if (payload) {
            this.dataSource.setValue(payload.join('-'));
            this.emitOuter('change', {
              value: this.dataSource.getValue(),
              id: this.dataSource.id
            });
          }
          break;
        case `${this.dataSource.id}.loaded`:
          this.dataSource.loadTooltips();
          break;
        default:
          break;
      }
    });
  }
}
