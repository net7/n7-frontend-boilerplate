import { LayoutDataSource } from '@n7-frontend/core';
import { SearchService } from 'n7-boilerplate-lib/lib/common/services';
import facetsConfig from './search-facets.config';
import fakeSearchRequest$ from './search-mock-request';
import { withLatestFrom } from 'rxjs/operators';

const SEARCH_ID = 'search-facets';

export class AwSearchLayoutDS extends LayoutDataSource {
  private communication: any;
  private configuration: any;
  private mainState: any;
  private search: SearchService;

  public currentPage: any = 1; // pagination value (url param)
  public pageSize: number = 10; // linked objects page size

  public options: any;

  onInit({configuration, mainState, options, communication, search }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.communication = communication;
    this.search = search;
    this.options = options;

    // FIXME: togliere
    const configKeys = this.configuration.get('config-keys');

    if(!this.search.model(SEARCH_ID)) this.search.add(SEARCH_ID, facetsConfig);
    const searchModel = this.search.model(SEARCH_ID),
      requestParams = searchModel.getRequestParams();

    // FIXME: mettere logica definitiva 
    // per la chiamata search
    /* 
    this.communication.request$('search', {
      onError: error => console.error(error),
      params: requestParams
    })
    */

    const fakeResultsRequest$ = this.communication.request$('getEntityDetails', {
      onError: error => console.error(error),
      params: { entityId: '55vf-entity-s3ar' }
    });

    fakeResultsRequest$.pipe(
      withLatestFrom(fakeSearchRequest$(requestParams, configKeys))
    ).subscribe(([resultsResponse, searchResponse]) => {

      searchModel.updateFacets(searchResponse.facets);
      searchModel.updateTotalCount(searchResponse.totalCount);
  
      this.one('facets-wrapper').update({ searchModel });

      this.one('aw-linked-objects').updateOptions({
        context: null,
        configKeys: this.configuration.get("config-keys"),
        page: this.currentPage,
        size: this.pageSize,
      });

      this.one('aw-linked-objects').update(resultsResponse.items);
    })

  }
}
