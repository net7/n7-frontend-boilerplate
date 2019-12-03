import { LayoutDataSource } from '@n7-frontend/core';
import {
  SearchService,
  SearchModel
} from 'n7-boilerplate-lib/lib/common/services';
import facetsConfig from './search-facets.config';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import helpers from 'n7-boilerplate-lib/lib/common/helpers';

const SEARCH_MODEL_ID = 'aw-search-layout';

export class AwSearchLayoutDS extends LayoutDataSource {
  private communication: any;
  private configuration: any;
  private mainState: any;
  private search: SearchService;
  private searchModel: SearchModel;
  private prettifyLabels: any;
  private configKeys: any;

  public pageTitle: string;
  public resultsTitle: string;
  public totalCount: number;
  public currentPage: any = 1; // pagination value (url param)
  public pageSize = 10; // linked objects page size

  public options: any;

  public orderByLabel = 'Ordina per';
  public orderByOptions: any = [
    {
      value: 'text_DESC',
      label: 'Ordine alfabetico (DESC)'
    },
    {
      value: 'text_ASC',
      label: 'Ordine alfabetico (ASC)'
    } /* {
    value: 'score_DESC',
    label: 'Ordine per rilevanza (DESC)'
  }, {
    value: 'score_ASC',
    label: 'Ordine per rilevanza (ASC)'
  }, {
    value: 'date_DESC',
    label: 'Ordina per data (DESC)'
  }, {
    value: 'date_ASC',
    label: 'Ordina per data (ASC)'
  } */
  ];

  onInit({ configuration, mainState, options, communication, search }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.communication = communication;
    this.search = search;
    this.options = options;
    this.prettifyLabels = this.configuration.get('labels');
    this.configKeys = this.configuration.get('config-keys');

    this.pageTitle = this.configuration.get('search-layout').title;

    if (!this.search.model(SEARCH_MODEL_ID)) {
      this.search.add(SEARCH_MODEL_ID, facetsConfig);
    }
    this.searchModel = this.search.model(SEARCH_MODEL_ID);

    this.doSearchRequest$().subscribe(() => {
      this.one('facets-wrapper').update({ searchModel: this.searchModel });
    });
  }

  onOrderByChange(payload) {
    const [orderBy, direction] = payload.split('_');

    this.searchModel.setSearchConfigOrderBy(orderBy);
    this.searchModel.setSearchConfigDirection(direction);
  }

  onPaginationChange(payload): Observable<boolean> {
    const page = payload.replace('page-', '');
    return this._updateSearchPage(page);
  }

  onPaginationGoToChange(payload) {
    const page = payload.replace('goto-', '');
    this._updateSearchPage(page);
  }

  onResultsLimitChange(payload) {
    this.pageSize = payload;
    this.searchModel.setPageConfigLimit(payload);

    // reset page & offset
    this.currentPage = 1;
    this.searchModel.setPageConfigOffset(0);
  }

  public getSearchModelId = () => SEARCH_MODEL_ID;

  public doSearchRequest$(): Observable<any> {
    const requestParams = this.searchModel.getRequestParams();
    const requestPayload = {
      searchParameters: {
        // FIXME: togliere totalCount
        totalCount: 100,
        ...requestParams
      }
    };
    return this.communication.request$('search', {
      onError: error => console.error(error),
      params: requestPayload
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
        this.resultsTitle = this.configuration.get('search-layout').results[
          resultsTitleIndex
        ];

        // facets labels
        this._addFacetsLabels(facets);
        // facets options
        this._addFacetsOptions(facets);

        this.searchModel.updateFacets(facets);
        this.searchModel.updateTotalCount(totalCount);

        this.one('aw-linked-objects').updateOptions({
          context: 'search',
          config: this.configuration,
          page: this.currentPage,
          size: this.pageSize
        });

        this.one('aw-linked-objects').update({ items: results.items });
      })
    );
  }

  private _updateSearchPage(page) {
    if (+page === this.currentPage) {
      return of(false);
    }

    this.currentPage = +page;

    const searchConfig = this.searchModel.getConfig(),
      pageConfig = searchConfig.page,
      { limit } = pageConfig,
      newOffset = (this.currentPage - 1) * limit;

    this.searchModel.setPageConfigOffset(newOffset);

    return of(true);
  }

  private _addFacetsLabels(facets) {
    facets
      .filter(f => Array.isArray(f.data))
      .forEach(f => {
        f.data.forEach(dataItem => {
          const key = dataItem.label;
          dataItem.label = helpers.prettifySnakeCase(key, this.prettifyLabels[key]);
        });
      });
  }

  private _addFacetsOptions(facets) {
    facets
      .filter(f => f.value === 'query-links')
      .forEach(f => {
        f.data.forEach(dataItem => {
          const config = this.configKeys[dataItem.value];
          dataItem.options = {
            icon: config.icon,
            classes: `color-${dataItem.value}`
          };
        });
      });
  }
}
