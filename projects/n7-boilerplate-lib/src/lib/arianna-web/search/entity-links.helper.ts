import { Subject, merge, fromEvent } from 'rxjs';
import {
  debounceTime, switchMap, mapTo
} from 'rxjs/operators';

let paginationState = {} as any;

export default {
  paginate$: new Subject(),
  listenToChanges(dataSource) {
    const facetsWrapperEH = dataSource.getWidgetEventHandler('facets-wrapper');
    return merge(
      facetsWrapperEH.internalFacetsChange$.pipe(mapTo(null)),
      this.paginate$,
    ).pipe(
      debounceTime(500),
      switchMap((pagination) => {
        const requestParams = dataSource.searchModel.getRequestParams();
        const internalFilters = dataSource.searchModel.getInternalFilters();
        if (pagination) {
          // FIXME: togliere as any!
          const entityLinks = internalFilters.find((filter) => filter.facetId === 'entity-links') as any;
          if (entityLinks) {
            entityLinks.pagination = pagination;
          } else {
            const { facetId, value, searchIn } = dataSource.searchModel.getFiltersByFacetId('entity-links')[0];
            internalFilters.push({
              facetId,
              value,
              searchIn,
              // FIXME: togliere commento
              // pagination: paginationState
            });
          }
          console.warn('fixme: aggiungere pagination request filters', internalFilters);
        }
        const filters = [...requestParams.filters, ...internalFilters];
        const params = {
          searchParameters: {
            // FIXME: togliere totalCount
            totalCount: 100,
            ...requestParams,
            filters
          },
        };
        return dataSource.getFacetsReq$(params);
      })
    );
  },
  paginationFilterControl(searchModel, facets) {
    // pagination control
    const { pagination } = searchModel.getFiltersByFacetId('entity-links')[0];
    // FIXME: togliere commento
    // const isPaginated = !!(pagination && pagination.offset > 0);
    const isPaginated = !!pagination;
    if (isPaginated) {
      const entityLinksInput = searchModel.getInputByFacetId('entity-links');
      const facet = facets.find(({ id }) => id === 'entity-links');
      const oldData = entityLinksInput.getData() || [];
      const newData = oldData.concat(facet.data);
      facet.data = newData;
    }
  },
  initPagination(searchModel) {
    searchModel.getFilters().filter((filter) => (
      filter.pagination
    )).forEach(({ pagination }) => {
      paginationState = {
        ...pagination,
        loading: false
      };
    });
    setTimeout(() => {
      const scrollEl = document.querySelector('.n7-facets-wrapper__group-aw-search-layout-1 .n7-facet__section-input-links');
      const scroll$ = fromEvent(scrollEl, 'scroll');
      scroll$.pipe(
        debounceTime(300)
      ).subscribe(({ target }) => {
        const { scrollTop, clientHeight, scrollHeight } = target as HTMLElement;
        const {
          offset, limit, totalCount, loading
        } = paginationState;
        const margin = 150;
        if (
          (scrollTop + clientHeight >= scrollHeight - margin)
          // FIXME: togliere commento
          // && (offset + limit < totalCount)
          && loading === false
        ) {
          console.warn('fixme: aggiungere controllo totalCount:', {
            offset, limit, totalCount, loading
          });
          // paginationState.loading = true;
          paginationState.offset = offset + limit;
          this.paginate$.next(paginationState);
        }
      });
    });
  }
};
