import { LayoutDataSource, LayoutBuilder } from '@n7-frontend/core';
import { SearchService } from 'n7-boilerplate-lib/lib/common/services';

const SEARCH_CONFIG = {
  facets: [{
    id: 'query', 
    type: 'value',
    data: []
  }, {
    id: 'query-all', 
    type: 'value',
    data: [{
      value: '1',
      label: 'Cerca in tutti campi delle schede'
    }]
  }, {
    id: 'query-links', 
    type: 'value',
    data: []
  }, {
    id: 'entity-types',
    type: 'value',
    data: []
  }, {
    id: 'entity-search', 
    type: 'value',
    data: []
  }, {
    id: 'entity-links', 
    type: 'value',
    data: []
  }, {
    id: 'date-from', 
    type: 'value',
    data: []
  }, {
    id: 'date-to', 
    type: 'value',
    data: []
  }],
  fields: [{
    inputs: [{
      type: 'text',
      facetId: 'query',
      placeholder: 'Cerca...',
      // icon: 'n7-icon-search',
      filterConfig: {
        delay: 500,
        minChars: 3, 
        searchIn: [{
          key: 'source.title',
          operator: 'LIKE'
        }]
      } 
    }, {
      type: 'checkbox',
      facetId: 'query-all',
      filterConfig: {
        searchIn: [{
          key: 'query-all',
          operator: '='
        }]
      }
    }, {
      type: 'link',
      facetId: 'query-links',
      filterConfig: {
        searchIn: [{
          key: 'source.entityType',
          operator: '='
        }]
      } 
    }]
  }, {
    header: {
      label: 'Relazione con',
      classes: 'related-class'
    },
    inputs: [{
      type: 'checkbox',
      facetId: 'entity-types',
      filterConfig: {
        isArray: true,
        context: 'internal',
        target: 'entity-links',
        searchIn: [{
          key: 'entity',
          operator: '='
        }]
      } 
    }, {
      type: 'text',
      facetId: 'entity-search',
      placeholder: 'Cerca entità',
      // icon: 'n7-icon-search',
      filterConfig: {
        delay: 500,
        minChars: 3, 
        context: 'internal',
        target: 'entity-links',
        searchIn: [{
          key: 'text',
          operator: 'LIKE'
        }]
      } 
    }, {
      type: 'link',
      facetId: 'entity-links',
      filterConfig: {
        limit: 20,
        searchIn: [{
          key: 'source.id',
          operator: '='
        }]
      } 
    }]
  }, {
    header: {
      label: 'Data',
      classes: 'date-class'
    },
    inputs: [{
      type: 'select',
      facetId: 'date-from',
      label: 'Dal',
      filterConfig: {
        searchIn: [{
          key: 'source.dateStart',
          operator: '>='
        }]
      } 
    }, {
      type: 'select',
      facetId: 'date-to',
      label: 'Al',
      filterConfig: {
        searchIn: [{
          key: 'source.dateEnd',
          operator: '<='
        }]
      } 
    }]
  }],
  resultFields: null,
  page: null,
  baseUrl: ''
}

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
    const configKeys = this.configuration.get('config-keys'),
      queryLinksData = Object.keys(configKeys).map(key => {
        const config = configKeys[key];
        return {
          value: key,
          label: config.label,
          count: 1,

          // questi vanno aggiunti a mano lato front-end
          icon: config.icon,
          classes: `color-${key}`
        };
      }),
      entityTypesData = Object.keys(configKeys).map(key => {
        const config = configKeys[key];
        return {
          value: key,
          label: config.label,
        };
      });

    SEARCH_CONFIG.facets.filter(facet => facet.id === 'query-links').forEach(facet => {
      facet.data = queryLinksData;
    });

    SEARCH_CONFIG.facets.filter(facet => facet.id === 'entity-types').forEach(facet => {
      facet.data = entityTypesData;
    });

    if(!this.search.model(SEARCH_ID)) this.search.add(SEARCH_ID, SEARCH_CONFIG);
    const searchModel = this.search.model(SEARCH_ID);
    this.one('facets-wrapper').update({ searchModel });
  }
}
