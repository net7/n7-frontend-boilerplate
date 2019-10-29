import { LayoutDataSource } from '@n7-frontend/core';
import { SearchService, SearchModel } from 'n7-boilerplate-lib/lib/common/services';
import facetsConfig from './search-facets.config';
import fakeSearchRequest$ from './search-mock-request';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const SEARCH_MODEL_ID = 'aw-search-layout';

export class AwSearchLayoutDS extends LayoutDataSource {
  private communication: any;
  private configuration: any;
  private mainState: any;
  private search: SearchService;
  private searchModel: SearchModel;

  public pageTitle: string;
  public resultsTitle: string;
  public totalCount: number;
  public currentPage: any = 1; // pagination value (url param)
  public pageSize: number = 10; // linked objects page size

  public options: any;

  public orderByLabel: string = 'Ordina per';
  public orderByOptions: any = [{
    value: 'text_DESC',
    label: 'Ordine alfabetico (DESC)'
  }, {
    value: 'text_ASC',
    label: 'Ordine alfabetico (ASC)'
  }, /* {
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
  } */];

  onInit({configuration, mainState, options, communication, search }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.communication = communication;
    this.search = search;
    this.options = options;

    this.pageTitle = this.configuration.get('search-layout').title;

    if(!this.search.model(SEARCH_MODEL_ID)) this.search.add(SEARCH_MODEL_ID, facetsConfig);
    this.searchModel = this.search.model(SEARCH_MODEL_ID);

    this.doSearchRequest$().subscribe(() => {
      this.one('facets-wrapper').update({ searchModel: this.searchModel });
    });
  }

  onOrderByChange(payload){
    const [orderBy, direction] = payload.split('_');

    this.searchModel.setSearchConfigOrderBy(orderBy);
    this.searchModel.setSearchConfigDirection(direction);
  }

  onPaginationChange(payload): Observable<boolean> {
    const page = payload.replace('page-', '');
    return this._updateSearchPage(page);
  }

  onPaginationGoToChange(payload){
    const page = payload.replace('goto-', '');
    this._updateSearchPage(page);
  }

  onResultsLimitChange(payload){
    this.pageSize = payload;
    this.searchModel.setPageConfigLimit(payload);
    
    // reset page & offset
    this.currentPage = 1;
    this.searchModel.setPageConfigOffset(0);
  }

  public getSearchModelId = () => SEARCH_MODEL_ID;

  public doSearchRequest$(): Observable<any> {
    // FIXME: togliere configKeys
    // dovrebbe venire dall'API
    const configKeys = this.configuration.get('config-keys');

    // FIXME: mettere logica definitiva 
    // per la chiamata search
    /* 
    this.communication.request$('search', {
      onError: error => console.error(error),
      params: requestParams
    })
    */

    const requestParams = this.searchModel.getRequestParams();

    const fakeResultsRequest$ = this.communication.request$('getEntityDetails', {
      onError: error => console.error(error),
      params: { entityId: '55vf-entity-s3ar' }
    });

    return fakeResultsRequest$.pipe(
      withLatestFrom(fakeSearchRequest$(requestParams, configKeys)),
      tap(([resultsResponse, searchResponse]) => {
        this.totalCount = searchResponse.totalCount;
        let resultsTitleIndex = 0;
        // results title
        if(this.totalCount > 1){
          resultsTitleIndex = 2;
        } else if(this.totalCount === 1) {
          resultsTitleIndex = 1;
        }
        this.resultsTitle = this.configuration.get('search-layout').results[resultsTitleIndex];
  
        this.searchModel.updateFacets(searchResponse.facets);
        this.searchModel.updateTotalCount(searchResponse.totalCount);
        
        this.one('aw-linked-objects').updateOptions({
          context: 'search',
          configKeys: this.configuration.get("config-keys"),
          // todo: swap to next line after merge
          // config: this.configuration
          page: this.currentPage,
          size: this.pageSize,
        });
  
        this.one('aw-linked-objects').update(resultsResponse.items);
      })
    );
  }

  private _updateSearchPage(page){
    if(+page === this.currentPage) return of(false);

    this.currentPage = +page;

    const searchConfig = this.searchModel.getConfig(),
      pageConfig = searchConfig.page,
      { limit } = pageConfig,
      newOffset = (this.currentPage - 1) * limit;

    this.searchModel.setPageConfigOffset(newOffset);

    return of(true);
  }
}
