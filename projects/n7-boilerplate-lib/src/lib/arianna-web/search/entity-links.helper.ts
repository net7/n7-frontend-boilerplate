import { Subject, merge, fromEvent } from 'rxjs';
import {
  debounceTime, switchMap, mapTo
} from 'rxjs/operators';

const ENTITY_LINKS_CLASS = 'entity-links';
const ENTITY_LINKS_PARENT_SELECTOR = '.n7-facets-wrapper__group:last-child .n7-facet__section-input-links';
const LOADER_ID = 'entity-links-loader';

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
          const entityLinks = internalFilters
            .find((filter) => filter.facetId === ENTITY_LINKS_CLASS);
          if (entityLinks) {
            entityLinks.pagination = pagination;
          } else {
            const {
              facetId, value, searchIn
            } = dataSource.searchModel.getFiltersByFacetId(ENTITY_LINKS_CLASS)[0];
            internalFilters.push({
              facetId,
              value,
              searchIn,
              pagination: paginationState
            });
          }
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

        // add loader
        this.addLoader();

        return dataSource.getFacetsReq$(params);
      })
    );
  },
  paginationFilterControl(searchModel, facets) {
    // pagination control
    const { pagination } = searchModel.getFiltersByFacetId(ENTITY_LINKS_CLASS)[0];
    const isPaginated = !!(pagination && pagination.offset > 0);
    if (isPaginated) {
      const entityLinksInput = searchModel.getInputByFacetId(ENTITY_LINKS_CLASS);
      const facet = facets.find(({ id }) => id === ENTITY_LINKS_CLASS);
      const oldData = entityLinksInput.getData() || [];
      const newData = oldData.concat(facet.data);
      facet.data = newData;

      // remove loader
      this.removeLoader();
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
      const scrollEl = document.querySelector(ENTITY_LINKS_PARENT_SELECTOR);
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
          && (offset + limit < totalCount)
          && loading === false
        ) {
          paginationState.loading = true;
          paginationState.offset = offset + limit;
          this.paginate$.next(paginationState);
        }
      });
    });
  },
  addLoader() {
    const scrollEl = document.querySelector(ENTITY_LINKS_PARENT_SELECTOR);
    const loader = document.createElement('div');
    const loaderText = document.createTextNode('loading...');
    loader.appendChild(loaderText);
    [
      'n7-facet__section-input',
      'n7-facet__section-input-link',
      'n7-facet__section-input-loader'
    ].forEach((loaderClass) => {
      loader.classList.add(loaderClass);
    });
    loader.id = LOADER_ID;
    scrollEl.appendChild(loader);
  },
  removeLoader() {
    const loader = document.getElementById(LOADER_ID);
    if (loader) {
      loader.parentElement.removeChild(loader);
    }
  }
};
