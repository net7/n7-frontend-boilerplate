import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class FacetsWrapperEH extends EventHandler {
  private _facetsChanged = false;

  private internalFacetsChange$: Subject<any> = new Subject();

  private externalFacetsChange$: Subject<any> = new Subject();

  public listen() {
    // listen to inner (widget) events
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facet': {
          // empty payload control
          if (!payload.eventPayload.inputPayload) {
            return;
          }
          const { facetId } = payload.eventPayload.inputPayload;
          const input = this.dataSource.getInputByFacetId(facetId);
          const context = input.getContext();
          this._facetsChanged = true;

          // update
          this.dataSource.onFacetChange(payload);

          // internal
          if (context === 'internal') {
            this.internalFacetsChange$.next(input.getTarget());
            // external
          } else {
            this.externalFacetsChange$.next();
          }
        }
          break;

        case 'facets-wrapper.facetheader':
          this.dataSource.toggleGroup(payload);
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      if (type.indexOf('queryparamschange') !== -1 && this.dataSource.searchModel) {
        this.dataSource.updateFiltersFromQueryParams(payload);
        this.dataSource.updateInputsFromFilters();
      }
    });

    // listen to global events
    EventHandler.globalEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'global.searchresponse':
          if (this.dataSource.searchModel && this.dataSource.searchModel.getId() === payload) {
            this.dataSource.updateInputLinks();
            const internalFilters = this.dataSource.searchModel.getInternalFilters();

            internalFilters.forEach((filter) => {
              const input = this.dataSource.searchModel.getInputByFacetId(filter.facetId);
              const target = input.getTarget();
              this.dataSource.filterTarget(target);
              this.dataSource.updateFilteredTarget(target);
            });
          }
          break;

        default:
          break;
      }
    });

    // internal facets change
    this.internalFacetsChange$.pipe(
      debounceTime(500),
    ).subscribe((target) => {
      this.dataSource.filterTarget(target);
      this.dataSource.updateFilteredTarget(target);
    });

    // internal facets change
    this.externalFacetsChange$.pipe(
      debounceTime(500),
    ).subscribe(() => {
      const requestParams = this.dataSource.getRequestParams();
      const queryParams = this.dataSource.filtersAsQueryParams(requestParams.filters);

      Object.keys(queryParams).forEach((key) => { queryParams[key] = queryParams[key] || null; });
      // signal
      this.emitOuter('facetschange');

      // reset page
      queryParams.page = 1;

      // router signal
      this.emitGlobal('navigate', {
        handler: 'router',
        path: [],
        queryParams,
      });
    });
  }
}
