import { LayoutDataSource } from '@n7-frontend/core';
import { SearchService } from 'n7-boilerplate-lib/lib/common/services';

let SEARCH_CONFIG = {
  facets: {
    query: {
      type: 'value'
    },
    'entity-types': {
      type: 'value',
      operator: 'OR',
      data: null
    },
    'entity-filter': {
      type: 'value'
    },
    modes: {
      type: 'range',
      ranges: [
        { from: 1, name: 'Mode 1' },
        { from: 1, to: 2, name: 'Mode 2' },
        { from: 2, to: 3, name: 'Mode 3' },
        { to: 4, name: 'Mode 4' },
      ]
    }
  },
  page: {
    limit: 20
  },
  resultFields: {
    title: {
      highlight: true
    },
    description: {
      highlight: true,
      limit: 100
    },
    date: {}
  },
  searchFields: {
    title: {
      weight: 10,
    },
    description: {
      weight: 5,
    },
    metadata: {}
  },
  fields: [{
    header: {
      label: 'Relazione con'
    },
    inputs: [{
      id: 'entity-types',
      type: 'checkbox',
      items: []
    }, {
      id: 'entity-search',
      type: 'internal-search',
      placeholder: 'Cerca entità',
      icon: 'n7-icon-search',
      payload: {
        id: 'entity-search',
        target: 'entity-filter'
      },
    }, {
      id: 'entity-filter',
      type: 'filter',
      limit: 100,
      items: []
    }]
  }],
  baseUrl: ''
}

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

    const configKeys = this.configuration.get('config-keys');
    SEARCH_CONFIG.facets['entity-types'].data = Object.keys(configKeys).map(key => ({
      value: key,
      label: configKeys[key].label
    }));

    try {
      this.search.add('search-layout', SEARCH_CONFIG);
    } catch(err){
      // do nothing
    }

    const searchModel = this.search.model('search-layout');
    this.one('facets').updateOptions({ searchModel });
    this.one('facets').update({ fields: searchModel.getFields() });
  }
}
