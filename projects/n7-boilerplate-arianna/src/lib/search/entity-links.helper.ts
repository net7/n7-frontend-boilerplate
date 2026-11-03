import { Subject, merge, fromEvent } from 'rxjs';
import {
  debounceTime, switchMap, mapTo
} from 'rxjs/operators';
// import { isEmpty } from 'lodash';

const ENTITY_LINKS_CLASS = 'entity-links';
const ENTITY_LINKS_SELECTOR = '.n7-facet__section-input-links';

/**
 * Returns the entity-links scroll container. It is the last links container
 * rendered in the facets wrapper, so this stays correct regardless of how
 * many other facet groups (e.g. the date range) follow it — unlike a
 * `:last-child` group selector, which breaks when another group is appended.
 */
function getEntityLinksScrollEl(): HTMLElement | null {
  const els = document.querySelectorAll(ENTITY_LINKS_SELECTOR);
  return (els[els.length - 1] as HTMLElement) || null;
}

const loaderItem = {
  counter: null,
  label: 'Caricamento in corso...',
  searchData: [],
  value: '__loading__',
};

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
        this.paginationState.offset = pagination ? this.paginationState.offset : 0;
        this.updateParamsOffset(requestParams);
        const filters = [...requestParams.filters, ...internalFilters];
        const params = {
          searchParameters: {
            totalCount: 100,
            gallery: !!(dataSource.searchModel.getId() === 'aw-gallery-layout'),
            ...requestParams,
            filters
          },
        };

        // initial loader
        if (this.paginationState.offset === 0) {
          this.addInitialLoader(dataSource);
        }

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
    this.paginationState.totalCount = totalCount;
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
      entityLinksFacet.data.push(loaderItem);
    }

    // empty state
    const entityLinksInput = searchModel.getInputByFacetId(ENTITY_LINKS_CLASS);
    entityLinksInput.setIsEmpty(!totalCount);

    // fix scroll
    if (offset === 0) {
      const scrollEl = getEntityLinksScrollEl();
      if (scrollEl) {
        scrollEl.scrollTop = 0;
      }
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
      const scrollEl = getEntityLinksScrollEl();
      if (!scrollEl) {
        return;
      }
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
  /* clearInternalFilters(searchModel) {
    const searchFilter = searchModel.getFiltersByFacetId('entity-search')[0];
    const typesFilter = searchModel.getFiltersByFacetId('entity-types')[0];
    if (!isEmpty(searchFilter.value) || !isEmpty(typesFilter.value)) {
      searchFilter.value = '';
      typesFilter.value = [];
      searchModel.updateInputsFromFilters();
    }
  }, */
  updateParamsOffset(params) {
    const entityLinksFilter = params.filters
      .find(({ facetId }) => facetId === ENTITY_LINKS_CLASS);

    if (entityLinksFilter) {
      entityLinksFilter.pagination.offset = this.paginationState.offset;
    }
  },
  resetOffset() {
    this.paginationState.offset = 0;
  },
  addInitialLoader(dataSource) {
    dataSource.searchModel.setInputData(ENTITY_LINKS_CLASS, [loaderItem]);
    const facetsWrapperDS = dataSource.getWidgetDataSource('facets-wrapper');
    facetsWrapperDS.updateInputLinks();
  }
};
