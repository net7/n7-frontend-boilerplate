import { LayoutDataSource } from '@n7-frontend/core';
import { SearchService, SearchModel } from 'n7-boilerplate-lib/lib/common/services';
import facetsConfig from './search-facets.config';
import fakeSearchRequest$ from './search-mock-request';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    value: 'title',
    label: 'Ordine alfabetico'
  }, {
    value: 'date',
    label: 'Ordina per data'
  }];

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
          context: null,
          configKeys: this.configuration.get("config-keys"),
          page: this.currentPage,
          size: this.pageSize,
        });
  
        this.one('aw-linked-objects').update(resultsResponse.items);
      })
    );
  }
}
