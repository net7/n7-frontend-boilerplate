import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import {
  debounceTime, takeUntil
} from 'rxjs/operators';
import helpers from '../../../common/helpers';
import entityLinksHelper from '../../search/entity-links.helper';

export class AwSearchLayoutEH extends EventHandler {
  public layoutId = 'aw-search-layout';

  private destroyed$: Subject<any> = new Subject();

  private route: any;

  /** Emits when any of the search-facets are changed */
  private facetsChange$: Subject<any> = new Subject();

  /** Emits when the pagination element
   * or the select-sort element are changed */
  private additionalParamsChange$: Subject<any> = new Subject();

  /** Last queried text, used to check if the text has changed */
  private previousText = '';

  /** Is true when the search is triggered with a new text-string */
  private textHasChanged = false;

  private scrollRefElement: HTMLElement;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.layoutId}.init`: {
          this.route = payload.route;
          this.dataSource.onInit(payload);
          this._listenToFacetsChange();
          this._listenToAdditionalParamsChange();
          this._listenToRouterChanges();
          this._listenToInternalFilters();
          const { value: textInput } = this.dataSource.searchModel.getFiltersByFacetId('query')[0];
          if ((textInput || '').length > 0) {
            this.dataSource.isSearchingText.next(true);
            setTimeout(() => {
              this.dataSource.onOrderByChange('_score_DESC');
              this.additionalParamsChange$.next(); // emit from observable stream
            }, 100);
          }
          // scroll top
          window.scrollTo(0, 0);
        } break;

        case `${this.layoutId}.destroy`:
          this.dataSource.onDestroy();
          this.destroyed$.next();
          break;

        case `${this.layoutId}.orderbychange`:
          // handle the change of result-order
          this.dataSource.onOrderByChange(payload);
          this.additionalParamsChange$.next(); // emit from observable stream
          break;

        case `${this.layoutId}.searchreset`:
          this.dataSource.resetButtonEnabled = false;
          this.dataSource.searchModel.clear();
          this.additionalParamsChange$.next();
          break;

        default:
          console.warn('(search) unhandled inner event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facetschange': {
          this.dataSource.resetPagination();
          const { value: textInput } = this.dataSource.searchModel.getFiltersByFacetId('query')[0];
          // Checks if <input type=text>'s value has changed
          this.textHasChanged = !!(textInput && (textInput !== this.previousText));
          this.previousText = textInput;
          const activeOrder = this.dataSource.orderByOptions.filter((d) => d.selected)[0].value;
          if (this.textHasChanged && (textInput || '').length > 0) {
            // Add sort by score option
            this.dataSource.isSearchingText.next(true);
          } else if ((textInput || '').length === 0 && /score/i.test(activeOrder)) {
            // Remove sort by score option
            this.dataSource.isSearchingText.next(false);
            setTimeout(() => {
              this.dataSource.onOrderByChange('label_sort_ASC');
              this.additionalParamsChange$.next(); // emit from observable stream
            }, 100);
          }
        } break;

        case 'n7-smart-pagination.change':
          this.dataSource.onResultsLimitChange(payload.value);
          this.additionalParamsChange$.next();
          break;

        default:
          break;
      }
    });
  }

  /**
   * Handles changes to any of the search-facets
   */
  private _listenToFacetsChange() {
    this.facetsChange$.pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.dataSource.resultsLoading = true;
      if (this.textHasChanged) {
        this.additionalParamsChange$.next();
      } else {
        this.dataSource.doSearchRequest$().subscribe(() => {
          this.dataSource.resultsLoading = false;
          this.dataSource.onSearchResponse();
          this.emitGlobal('searchresponse', this.dataSource.getSearchModelId());
        });
      }
    });
  }

  /**
   * Handles entity links pagination
   */
  private _listenToInternalFilters() {
    entityLinksHelper.listenToChanges(this.dataSource)
      .subscribe(() => {
        this.emitGlobal('searchresponse', this.dataSource.getSearchModelId());
      });
  }

  /**
   * Handles changes happening on pagination and select elements.
   */
  private _listenToAdditionalParamsChange() {
    this.additionalParamsChange$.subscribe(() => {
      const { searchModel } = this.dataSource;
      const requestParams = searchModel.getRequestParams();
      const queryParams = searchModel.filtersAsQueryParams(requestParams.filters);

      Object.keys(queryParams).forEach((key) => { queryParams[key] = queryParams[key] || null; });

      // aditional params
      queryParams.orderby = this.dataSource.orderBy;
      queryParams.orderdirection = this.dataSource.orderDirection;
      queryParams.page = this.dataSource.currentPage;
      queryParams.limit = this.dataSource.pageSize;

      // If the searched text was updated, overwrite the query params and force sorting by "score".
      if (this.textHasChanged) {
        queryParams.orderby = '_score';
        queryParams.orderdirection = 'DESC';
        this.textHasChanged = false;
      }

      this.emitGlobal('navigate', {
        handler: 'router',
        path: [],
        queryParams,
      });

      this.facetsChange$.next();
    });
  }

  /** URL changes */
  private _listenToRouterChanges() {
    this.route.queryParams.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((params) => {
      this.emitOuter('queryparamschange', params);
      // aditional params control
      if (params.orderby && params.orderdirection) {
        this.dataSource.onOrderByChange(`${params.orderby}_${params.orderdirection}`);
      }
      if (params.page) {
        this.dataSource.onPaginationChange(`page-${params.page}`);
      }
      if (params.limit) {
        this.dataSource.setLimit(+params.limit);
      }
      this.facetsChange$.next();// scroll to ref element
      if (!this.scrollRefElement) {
        this.scrollRefElement = document.querySelector('.scroll-ref');
      } else if (!helpers.isElementInViewport(this.scrollRefElement)) {
        this.scrollRefElement.scrollIntoView();
      }
    });
  }
}
