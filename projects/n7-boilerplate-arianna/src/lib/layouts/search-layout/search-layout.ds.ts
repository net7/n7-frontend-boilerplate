import { cloneDeep } from 'lodash';
import { LayoutDataSource } from '@net7/core';
import {
  tap, takeUntil
} from 'rxjs/operators';
import {
  Observable, of, fromEvent, Subject, BehaviorSubject, forkJoin
} from 'rxjs';
import { helpers } from '@net7/boilerplate-common';
import facetsConfig from './search-facets.config';
import { AwSearchService } from '../../search/aw-search.service';
import { AwSearchModel } from '../../search/aw-search.model';
import entityLinksHelper from '../../search/entity-links.helper';
import { getHeadTitle } from '../../helpers/title.helper';

export class AwSearchLayoutDS extends LayoutDataSource {
  public layoutId = 'aw-search-layout';

  public configId = 'search-layout';

  public currentNav = 'ricerca';

  public pageNameDefault = 'Ricerca';

  public facetsConfig: any = facetsConfig;

  public paginationList = [10, 25, 50];

  protected destroyed$: Subject<void> = new Subject();

  protected communication: any;

  protected configuration: any;

  protected mainState: any;

  protected search: AwSearchService;

  protected searchModel: AwSearchModel;

  protected prettifyLabels: any;

  protected configKeys: any;

  public fallback: string;

  public resetButtonEnabled = true;

  public pageTitle: string;

  public resultsTitle: string;

  public totalCount: number;

  /** Pagination value (url parameter) */
  public currentPage: any = 1;

  /** Linked objects page size */
  public pageSize = 10;

  public sidebarIsSticky = false;

  public isFirstLoading = true;

  public resultsLoading = false;

  /** True when the user has input a text string */
  public isSearchingText = new BehaviorSubject(false);

  /** Current order method */
  public orderBy = 'label_sort';

  /** Current order direction */
  public orderDirection = 'ASC';

  public options: any;

  public orderByLabel = 'Ordina per';

  /** Options used to render the HTMLSelect */
  public orderByOptions: any = [
    {
      value: '_score_DESC',
      label: 'Ordine per pertinenza',
      type: 'score',
      selected: false
    }, {
      value: 'label_sort_ASC',
      label: 'Ordine alfabetico (A→Z)',
      type: 'text',
      selected: true // Mirrors the default sorting method in `search-facets.config.ts`
    }, {
      value: 'label_sort_DESC',
      label: 'Ordine alfabetico (Z→A)',
      type: 'text',
      selected: false
    }
  ];

  onInit({
    configuration, mainState, options, communication, search,
  }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.communication = communication;
    this.search = search;
    this.options = options;
    this.prettifyLabels = this.configuration.get('labels');
    this.configKeys = this.configuration.get('config-keys');
    this.fallback = this.configuration.get(this.configId).fallback;
    this.pageTitle = this.configuration.get(this.configId).title;

    // remove first
    // stateless search
    if (this.search.model(this.layoutId)) {
      this.search.remove(this.layoutId);
    }
    const facetsConfig = cloneDeep(this.facetsConfig);
    this._applyValidationOverrides(facetsConfig);
    this.search.add(this.layoutId, facetsConfig);
    this.searchModel = this.search.model(this.layoutId);

    // query params control
    if (AwSearchModel.queryParams) {
      this.searchModel.updateFiltersFromQueryParams(AwSearchModel.queryParams);
      AwSearchModel.queryParams = null;
    }
    this._sidebarStickyControl();
    this.mainState.updateCustom('currentNav', this.currentNav);

    // set head title
    this.setHeadTitle();
  }

  onDestroy() {
    this.destroyed$.next();
    AwSearchModel.queryParams = null;
  }

  onSearchResponse() {
    this.resetButtonEnabled = true;
    if (this.isFirstLoading) {
      this.isFirstLoading = false;
      this.one('facets-wrapper').update({ searchModel: this.searchModel });
      this.searchModel.updateInputsFromFilters();
    }
  }

  /**
   * Handles changes of the HTMLSelect order control
   * @param payload _score_DESC, label_sort_ASC, label_sort_DESC
   */
  onOrderByChange(payload: string) {
    const orderBy = payload.substring(0, payload.lastIndexOf('_'));
    const direction = payload.substring(payload.lastIndexOf('_') + 1);
    let type = '';
    // set selected
    this.orderByOptions.forEach((option) => {
      if (option.value === payload) {
        option.selected = true;
        type = option.type;
      } else {
        option.selected = false;
      }
    });
    this.orderBy = orderBy;
    this.orderDirection = direction;
    this.searchModel.setSearchConfigOrderBy(orderBy);
    this.searchModel.setSearchConfigDirection(direction);
    this.searchModel.setSearchConfigType(type);
  }

  onPageSizeChange(size): Observable<boolean> {
    this.pageSize = size;
    return this._updateSearchPage(this.currentPage);
  }

  onPaginationChange(payload): Observable<boolean> {
    const page = payload.replace('page-', '');
    return this._updateSearchPage(page);
  }

  onPaginationGoToChange(payload): Observable<boolean> {
    const page = payload.replace('goto-', '');
    return this._updateSearchPage(page);
  }

  drawPagination = () => {
    const { href, queryParams } = this._getPaginationParams();
    this.one('n7-smart-pagination').updateOptions({
      mode: 'href',
      href,
      queryParams,
    });
    this.one('n7-smart-pagination').update({
      totalPages: Math.ceil(this.totalCount / this.pageSize),
      currentPage: this.currentPage,
      pageLimit: 5,
      sizes: {
        label: 'Numero di risultati',
        list: this.paginationList,
        active: this.pageSize,
      },
    });
  };

  resetPagination() {
    this._updateSearchPage(1);
  }

  onResultsLimitChange(payload) {
    this.setLimit(payload);

    // reset page & offset
    this.currentPage = 1;
    this.searchModel.setPageConfigOffset(0);
  }

  setLimit(payload) {
    this.pageSize = payload;
    this.searchModel.setPageConfigLimit(payload);
    this.searchModel.setPageConfigOffset((this.currentPage - 1) * this.pageSize);
  }

  public getSearchModelId = () => this.layoutId;

  private getResultsReq$(params): Observable<any> {
    return this.communication.request$('search', {
      params,
      onError: (error) => console.error(error),
    }).pipe(
      tap(({ totalCount, results }) => {
        this.totalCount = totalCount;
        let resultsTitleIndex = 0;
        // results title
        if (this.totalCount > 1) {
          resultsTitleIndex = 2;
        } else if (this.totalCount === 1) {
          resultsTitleIndex = 1;
        }
        this.resultsTitle = this.configuration.get(this.configId).results[
          resultsTitleIndex
        ];
        this.searchModel.updateTotalCount(totalCount);

        this.one('aw-linked-objects').updateOptions({
          context: this.configId === 'gallery-layout' ? 'gallery' : 'search',
          config: this.configuration,
          page: this.currentPage,
          pagination: true,
          paginationParams: this._getPaginationParams(),
          dynamicPagination: {
            total: totalCount,
          },
          size: this.pageSize,
        });
        this.drawPagination();
        this.one('aw-linked-objects').update({ items: this._normalizeItems(results.items) });
      }),
    );
  }

  private getFacetsReq$(params) {
    return this.communication.request$('facets', {
      params,
      onError: (error) => console.error(error),
    }).pipe(
      tap(({ facets }) => {
        // entity links pagination control
        entityLinksHelper.onFacetsResponse(this.searchModel, facets);
        // facets labels
        this._addFacetsLabels(facets);
        // facets options
        this._addFacetsOptions(facets);
        this.searchModel.updateFacets(facets);
      }),
    );
  }

  public doSearchRequest$(): Observable<any> {
    const requestParams = this.searchModel.getRequestParams();
    const params = {
      searchParameters: {
        totalCount: 0, // fake param for apollo
        gallery: !!(this.configId === 'gallery-layout'),
        ...requestParams,
      },
    };
    // update offset
    entityLinksHelper.resetOffset();
    entityLinksHelper.updateParamsOffset(params.searchParameters);
    // initial loader
    entityLinksHelper.addInitialLoader(this);

    const resultsReq$ = this.getResultsReq$(params);
    const facetsReq$ = this.getFacetsReq$(params);
    return forkJoin(resultsReq$, facetsReq$);
  }

  private _updateSearchPage(page) {
    if (+page === this.currentPage) {
      return of(false);
    }

    this.currentPage = +page;

    const searchConfig = this.searchModel.getConfig();
    const pageConfig = searchConfig.page;
    const { limit } = pageConfig;
    const newOffset = (this.currentPage - 1) * limit;

    this.searchModel.setPageConfigOffset(newOffset);

    return of(true);
  }

  /**
   * Lets the consumer app customize per-facet input validation from its
   * layout configuration, keyed by `facetId`, without forking the default
   * facets config. Each override replaces that input's `validation` and may
   * provide a `validator(value) => boolean` function and/or a `pattern`
   * (RegExp or string), plus a `message`. Setting an override to a falsy
   * value disables validation for that facet.
   *
   * Example (app config under the layout's config id):
   *   facetsValidation: {
   *     'date-from': { pattern: /.../, message: '…' },
   *     'date-to': { validator: (v) => isRealDate(v), message: '…' },
   *   }
   */
  private _applyValidationOverrides(facetsConfig) {
    const overrides = this.configuration.get(this.configId)?.facetsValidation;
    if (!overrides || !facetsConfig?.fields) {
      return;
    }
    facetsConfig.fields.forEach((field) => {
      (field.inputs || []).forEach((input) => {
        if (input.facetId && Object.prototype.hasOwnProperty.call(overrides, input.facetId)) {
          input.validation = overrides[input.facetId];
        }
      });
    });
  }

  private _addFacetsLabels(facets) {
    facets
      .filter((f) => Array.isArray(f.data))
      .forEach((f) => {
        f.data.forEach((dataItem) => {
          const key = dataItem.label;
          dataItem.label = (
            this.configKeys[key]?.label
            || helpers.prettifySnakeCase(key, this.prettifyLabels[key])
          );
        });
      });
  }

  private _addFacetsOptions(facets) {
    facets
      .filter((f) => f.id === 'query-links')
      .forEach((f) => {
        f.data.forEach((dataItem) => {
          const config = this.configKeys[dataItem.value];
          if (config) {
            dataItem.options = {
              icon: config.icon,
              classes: `color-${config['class-name']}`,
            };
          }
        });
      });
  }

  private _normalizeItems(items) {
    return items.map((singleItem) => ({ item: { ...singleItem } }));
  }

  private _sidebarStickyControl() {
    // no sticky for Internet Explorer
    if (helpers.browserIsIE()) {
      return;
    }
    const source$ = fromEvent(window, 'scroll');

    source$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      const windowOffsetTop = window.pageYOffset;
      const stickyParent = document.getElementsByClassName('sticky-parent')[0] as HTMLElement;
      const wrapperOffsetTop = stickyParent ? stickyParent.offsetTop : 0;
      this.sidebarIsSticky = wrapperOffsetTop <= windowOffsetTop;
    });
  }

  private _getPaginationParams() {
    const requestParams = this.searchModel.getRequestParams();
    const queryParams = this.searchModel.filtersAsQueryParams(requestParams.filters);

    Object.keys(queryParams).forEach((key) => { queryParams[key] = queryParams[key] || null; });

    // aditional params
    queryParams.orderby = this.orderBy;
    queryParams.orderdirection = this.orderDirection;
    queryParams.page = this.currentPage;
    queryParams.limit = this.pageSize;

    let href = this.configuration.get('paths').searchBasePath;
    if (this.configId === 'gallery-layout') {
      href = this.configuration.get('paths').galleryBasePath;
    }

    return {
      href,
      queryParams,
    };
  }

  private setHeadTitle() {
    this.mainState.update('headTitle', getHeadTitle({
      name: this.configuration.get('customer'),
      pageName: this.configuration.get(this.configId)?.pageName,
      pageDefault: this.pageNameDefault,
    }));
  }
}
