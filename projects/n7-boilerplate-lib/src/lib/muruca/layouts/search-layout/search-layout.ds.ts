import { LayoutDataSource } from '@n7-frontend/core';
import { cloneDeep } from 'lodash';
import {
  SearchService,
  SearchModel,
} from '../../../common/services';
import facetsConfig from './search-facets.config';
// import helpers from '../../../common/helpers';

const SEARCH_MODEL_ID = 'mr-search-layout';

export class MrSearchLayoutDS extends LayoutDataSource {
  private search: SearchService;

  private searchModel: SearchModel;

  onInit({
    // configuration, mainState, options, communication,
    search,
  }) {
    this.search = search;
    if (this.search.model(SEARCH_MODEL_ID)) {
      this.search.remove(SEARCH_MODEL_ID);
    }
    this.search.add(SEARCH_MODEL_ID, cloneDeep(facetsConfig));
    this.searchModel = this.search.model(SEARCH_MODEL_ID);
    // this.one('facets-wrapper').update({ searchModel: this.searchModel });

    this.one('mr-resources').updateOptions({ source: 'search' });
    this.one('mr-resources').update({});
  }
}
