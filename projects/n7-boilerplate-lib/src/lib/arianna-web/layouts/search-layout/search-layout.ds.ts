import { LayoutDataSource } from '@n7-frontend/core';
import { SearchService } from 'n7-boilerplate-lib/lib/common/services';
import facetsConfig from './search-facets.config';
import mockRequest from './search-mock-request';

const SEARCH_ID = 'search-facets';

export class AwSearchLayoutDS extends LayoutDataSource {
  private communication: any;
  private configuration: any;
  private mainState: any;
  private search: SearchService;

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

    // FIXME: togliere
    /* 
    this.communication.request$('search', {
      onError: error => console.error(error),
      params: requestParams
    })
    */

    mockRequest(requestParams, configKeys).subscribe(response => {
      searchModel.updateFacets(response.facets);
      searchModel.updateTotalCount(response.totalCount);

      console.log('searchModel', searchModel.getTotalCount(), searchModel.getFacets());

      this.one('facets-wrapper').update({ searchModel });
    });

  }
}
