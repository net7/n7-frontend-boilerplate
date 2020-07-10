import { Subject, merge, fromEvent } from 'rxjs';
import {
  debounceTime, switchMap, mapTo
} from 'rxjs/operators';

const ENTITY_LINKS_CLASS = 'entity-links';
const ENTITY_LINKS_PARENT_SELECTOR = '.n7-facets-wrapper__group:last-child .n7-facet__section-input-links';

export default {
  paginationState: {} as any,
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
          const { limit, offset } = this.paginationState;
          const entityLinks = internalFilters
            .find((filter) => filter.facetId === ENTITY_LINKS_CLASS);
          if (entityLinks) {
            entityLinks.pagination = { limit, offset };
          } else {
            const {
              facetId, value, searchIn
            } = dataSource.searchModel.getFiltersByFacetId(ENTITY_LINKS_CLASS)[0];
            internalFilters.push({
              facetId,
              value,
              searchIn,
              pagination: { limit, offset }
            });
          }
        } else {
          this.paginationState.offset = 0;
        }
        const filters = [...requestParams.filters, ...internalFilters];
        const params = {
          searchParameters: {
            totalCount: 100,
            gallery: !!(dataSource.searchModel.getId() === 'aw-gallery-layout'),
            ...requestParams,
            filters
          },
        };

        return dataSource.getFacetsReq$(params);
      })
    );
  },
  onFacetsResponse(searchModel, facets) {
    // pagination control
    const entityLinksFacet = facets.find(({ id }) => id === ENTITY_LINKS_CLASS);
    const { totalCount } = entityLinksFacet;
    let { limit, offset } = this.paginationState;
    if (typeof limit === 'undefined') {
      limit = 10;
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    // FIXME: togliere oppure
    this.paginationState.totalCount = totalCount || 50;
    if (offset > 0) {
      const entityLinksInput = searchModel.getInputByFacetId(ENTITY_LINKS_CLASS);
      const oldData = entityLinksInput.getData() || [];
      // remove fake loading element
      if (oldData.length) {
        oldData.pop();
      }
      const newData = oldData.concat(entityLinksFacet.data);
      entityLinksFacet.data = newData;
    }

    if (this.paginationState.totalCount > (limit + offset)) {
      entityLinksFacet.data.push({
        counter: null,
        label: 'Loading...',
        searchData: [],
        value: 'loading',
      });
    }

    // update loading state
    this.paginationState.loading = false;
  },
  initPagination(searchModel) {
    searchModel.getFilters().filter((filter) => (
      filter.pagination
    )).forEach(({ pagination }) => {
      this.paginationState = {
        ...pagination,
        ...this.paginationState,
        loading: false
      };
    });
    setTimeout(() => {
      const scrollEl = document.querySelector(ENTITY_LINKS_PARENT_SELECTOR);
      const scroll$ = fromEvent(scrollEl, 'scroll');
      scroll$.pipe(
        debounceTime(300)
      ).subscribe(({ target }) => {
        const { scrollTop, clientHeight, scrollHeight } = target as HTMLElement;
        const {
          offset, limit, totalCount, loading
        } = this.paginationState;
        const margin = 150;
        if (
          (scrollTop + clientHeight >= scrollHeight - margin)
          && (offset + limit < totalCount)
          && loading === false
        ) {
          this.paginationState.loading = true;
          this.paginationState.offset = offset + limit;
          this.paginate$.next(this.paginationState);
        }
      });
    });
  },
  updatePaginationState(newState) {
    this.paginationState = {
      ...this.paginationState,
      ...newState
    };
  }
};
