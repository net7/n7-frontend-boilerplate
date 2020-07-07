import { cloneDeep } from 'lodash';
import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { tap, takeUntil } from 'rxjs/operators';
import {
  Observable, of, fromEvent, Subject, BehaviorSubject,
} from 'rxjs';
import facetsConfig from './gallery-facets.config';
import helpers from '../../../common/helpers';
import { AwSearchService } from '../../search/aw-search.service';
import { AwSearchModel } from '../../search/aw-search.model';

const SEARCH_MODEL_ID = 'aw-gallery-layout';

export class AwGalleryLayoutDS extends LayoutDataSource {
  private destroyed$: Subject<any> = new Subject();

  private communication: any;

  private configuration: any;

  private mainState: any;

  private search: AwSearchService;

  private searchModel: AwSearchModel;

  private prettifyLabels: any;

  private configKeys: any;

  private fallback: string;

  private resetButtonEnabled = true;

  public pageTitle: string;

  public resultsTitle: string;

  public totalCount: number;

  public currentPage: any = 1; // pagination value (url param)

  public pageSize = 12; // linked objects page size

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

  public orderByOptions: any = [
    {
      value: '_score_DESC',
      label: 'Ordine per pertinenza',
      type: 'score',
      selected: false
    },
    {
      value: 'label_sort_ASC',
      label: 'Ordine alfabetico (A→Z)',
      type: 'text',
      selected: true

    },
    {
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
    this.fallback = this.configuration.get('gallery-layout').fallback;

    this.pageTitle = this.configuration.get('gallery-layout').title;

    // remove first
    // stateless search
    if (this.search.model(SEARCH_MODEL_ID)) {
      this.search.remove(SEARCH_MODEL_ID);
    }

    this.search.add(SEARCH_MODEL_ID, cloneDeep(facetsConfig));
    this.searchModel = this.search.model(SEARCH_MODEL_ID);

    // query params control
    if (AwSearchModel.queryParams) {
      this.searchModel.updateFiltersFromQueryParams(AwSearchModel.queryParams);
      AwSearchModel.queryParams = null;
    }

    // sidebar sticky control
    this._sidebarStickyControl();

    this.mainState.updateCustom('currentNav', 'galleria');
    this.mainState.update('headTitle', 'Arianna4View - Galleria');
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
  onOrderByChange(payload) {
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
        list: [12, 24, 48],
        active: this.pageSize,
      },
    });
  }

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

  public getSearchModelId = () => SEARCH_MODEL_ID;

  public doSearchRequest$(): Observable<any> {
    const requestParams = this.searchModel.getRequestParams();
    const requestPayload = {
      searchParameters: {
        // FIXME: togliere totalCount
        totalCount: 100,
        gallery: true,
        ...requestParams,
      },
    };
    return this.communication.request$('search', {
      onError: (error) => console.error(error),
      params: requestPayload,
    }).pipe(
      tap(({ totalCount, results, facets }) => {
        this.totalCount = totalCount;
        let resultsTitleIndex = 0;
        // results title
        if (this.totalCount > 1) {
          resultsTitleIndex = 2;
        } else if (this.totalCount === 1) {
          resultsTitleIndex = 1;
        }
        this.resultsTitle = this.configuration.get('gallery-layout').results[
          resultsTitleIndex
        ];

        // facets labels
        this._addFacetsLabels(facets);
        // facets options
        this._addFacetsOptions(facets);

        this.searchModel.updateFacets(facets);
        this.searchModel.updateTotalCount(totalCount);

        this.one('aw-linked-objects').updateOptions({
          context: 'gallery',
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

  private _addFacetsLabels(facets) {
    facets
      .filter((f) => Array.isArray(f.data))
      .forEach((f) => {
        f.data.forEach((dataItem) => {
          const key = dataItem.label;
          dataItem.label = helpers.prettifySnakeCase(key, this.prettifyLabels[key]);
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

    return {
      queryParams,
      href: this.configuration.get('paths').galleryBasePath,
    };
  }
}
