import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export class AwGalleryLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  private configuration: any;

  private route: any;

  /** Emits when any of the gallery-facets are changed */
  private facetsChange$: Subject<any> = new Subject();

  /** Emits when the pagination element
   * or the select-sort element are changed */
  private additionalParamsChange$: Subject<any> = new Subject();

  /** Last queried text, used to check if the text has changed */
  private previousText = '';

  /** Is true when the search is triggered with a new text-string */
  private textHasChanged = false;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-gallery-layout.init':
          this.route = payload.route;
          this.configuration = payload.configuration;
          this.dataSource.onInit(payload);
          this._listenToFacetsChange();
          this._listenToAdditionalParamsChange();
          this._listenToRouterChanges();
          break;

        case 'aw-gallery-layout.destroy':
          this.dataSource.onDestroy();
          this.destroyed$.next();
          break;

        case 'aw-gallery-layout.orderbychange':
          // handle the change of result-order
          this.dataSource.onOrderByChange(payload);
          this.additionalParamsChange$.next(); // emit from observable stream
          break;

        case 'aw-gallery-layout.searchreset':
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
          if (this.textHasChanged && textInput.length > 0) {
            // Add sort by score option
            this.dataSource.isSearchingText.next(true);
          } else if (textInput.length === 0) {
            // Remove sort by score option
            this.dataSource.isSearchingText.next(false);
            setTimeout(() => {
              this.dataSource.onOrderByChange('label_sort_DESC');
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
        this.textHasChanged = false; // reset
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
      }

      this.emitGlobal('navigate', {
        handler: 'router',
        path: [],
        queryParams,
      });
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
      this.facetsChange$.next();
    });
  }
}
