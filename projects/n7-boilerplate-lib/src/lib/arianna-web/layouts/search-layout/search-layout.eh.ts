import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export class AwSearchLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  private route: any;

  private facetsChange$: Subject<any> = new Subject();

  private aditionalParamsChange$: Subject<any> = new Subject();

  private configuration: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-search-layout.init':
          this.route = payload.route;
          this.configuration = payload.configuration;
          this.dataSource.onInit(payload);
          this._listenToFacetsChange();
          this._listenToAditionalParamsChange();
          this._listenToRouterChanges();
          break;

        case 'aw-search-layout.destroy':
          this.dataSource.onDestroy();
          this.destroyed$.next();
          break;

        case 'aw-search-layout.orderbychange':
          this.dataSource.onOrderByChange(payload);
          this.aditionalParamsChange$.next();
          break;

        case 'aw-search-layout.searchreset':
          this.dataSource.resetButtonEnabled = false;
          this.dataSource.searchModel.clear();
          this.aditionalParamsChange$.next();
          break;

        default:
          console.warn('(search) unhandled inner event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'facets-wrapper.facetschange':
          this.dataSource.resetPagination();
          break;

        case 'n7-smart-pagination.change':
          this.dataSource.onResultsLimitChange(payload.value);
          this.aditionalParamsChange$.next();
          break;

        default:
          break;
      }
    });
  }

  private _listenToFacetsChange() {
    this.facetsChange$.pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.dataSource.resultsLoading = true;
      this.dataSource.doSearchRequest$().subscribe(() => {
        this.dataSource.resultsLoading = false;
        this.dataSource.onSearchResponse();
        this.emitGlobal('searchresponse', this.dataSource.getSearchModelId());
      });
    });
  }

  private _listenToAditionalParamsChange() {
    this.aditionalParamsChange$.subscribe(() => {
      const { searchModel } = this.dataSource;
      const requestParams = searchModel.getRequestParams();
      const queryParams = searchModel.filtersAsQueryParams(requestParams.filters);

      Object.keys(queryParams).forEach((key) => { queryParams[key] = queryParams[key] || null; });

      // aditional params
      queryParams.orderby = this.dataSource.orderBy;
      queryParams.orderdirection = this.dataSource.orderDirection;
      queryParams.page = this.dataSource.currentPage;
      queryParams.limit = this.dataSource.pageSize;

      // router signal
      this.emitGlobal('navigate', {
        handler: 'router',
        path: [],
        queryParams,
      });
    });
  }

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
