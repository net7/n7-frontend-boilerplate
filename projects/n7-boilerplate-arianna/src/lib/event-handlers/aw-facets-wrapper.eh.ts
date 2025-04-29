import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class AwFacetsWrapperEH extends EventHandler {
  public internalFacetsChange$: Subject<any> = new Subject();

  public externalFacetsChange$: Subject<any> = new Subject();

  public listen() {
    // listen to inner (widget) events
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facet': {
          // empty payload control
          if (!payload.eventPayload.inputPayload) {
            return;
          }
          const { facetId, value } = payload.eventPayload.inputPayload;
          if (value === '__loading__') {
            return;
          }
          const input = this.dataSource.getInputByFacetId(facetId);
          const context = input.getContext();

          // OLD-VERSION
          // let context;
          // let input;
          // if (facetId === 'query-interval') {
          //   input = null;
          //   context = 'external';
          // } else {
          //   input = this.dataSource.getInputByFacetId(facetId);
          //   context = input.getContext();
          // }

          // update
          this.dataSource.onFacetChange(payload);

          // internal
          if (context === 'internal') {
            this.internalFacetsChange$.next(input.getTarget());
            // external
          } else {
            this.externalFacetsChange$.next(facetId);

            // OLD-VERSION
            // this.externalFacetsChange$.next({ facetId, payload });
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
              // this.dataSource.filterTarget(target);
              this.dataSource.updateFilteredTarget(target);
            });
          }
          break;

        default:
          break;
      }
    });

    // internal facets change
    this.externalFacetsChange$.pipe(
      debounceTime(500),
    ).subscribe((facetId) => {
      // OLD-VERSION
      // ).subscribe(({ facetId, payload }) => {
      const requestParams = this.dataSource.getRequestParams();
      const queryParams = this.dataSource.filtersAsQueryParams(requestParams.filters);

      // OLD-VERSION
      // if (facetId === 'query-interval') {
      //   queryParams['query-interval'] = this.createIntervalParams(payload);
      // }

      Object.keys(queryParams).forEach((key) => { queryParams[key] = queryParams[key] || null; });
      // signal
      this.emitOuter('facetschange', { facetId });

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

  // OLD-VERSION
  // createIntervalParams(payload) {
  //   const interval = payload.eventPayload.inputPayload.value;
  //   const { from } = interval;
  //   const { to } = interval;
  //   const param = `${this.cleanYear(from)}_${this.cleanYear(to)}`;
  //   return param;
  // }

  // OLD-VERSION
  // cleanYear(year) {
  //   if (year.endsWith('a.C.')) {
  //     return `-${year.trim().match(/^(\d+)\s*a\.C\.$/i)[1]}`;
  //   }
  //   return year;
  // }
}
