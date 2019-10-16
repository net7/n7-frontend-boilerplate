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
      id: 'query',
      type: 'search',
      placeholder: 'Cerca...',
      // icon: 'n7-icon-search',
      options: {
        delay: 500,
        minChars: 3, 
      },
      filterConfig: {
        facetId: 'query',
        searchIn: [{
          key: 'source.title',
          operator: 'LIKE'
        }]
      } 
    }, {
      id: 'query-all',
      type: 'checkbox',
      filterConfig: {
        facetId: 'query-all',
        searchIn: [{
          key: 'query-all',
          operator: '='
        }]
      }
    }, {
      id: 'query-links',
      type: 'link',
      filterConfig: {
        facetId: 'query-links',
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
      id: 'entity-types',
      type: 'checkbox',
      filterConfig: {
        isArray: true,
        facetId: 'entity-types',
        context: 'internal',
        target: 'entity-links',
        searchIn: [{
          key: 'entity',
          operator: '='
        }]
      } 
    }, {
      id: 'entity-search',
      type: 'search',
      placeholder: 'Cerca entità',
      // icon: 'n7-icon-search',
      options: {
        delay: 500,
        minChars: 3, 
      },
      filterConfig: {
        facetId: 'entity-search',
        context: 'internal',
        target: 'entity-links',
        searchIn: [{
          key: 'text',
          operator: 'LIKE'
        }]
      } 
    }, {
      id: 'entity-links',
      type: 'link',
      options: {
        limit: 20,
      },
      filterConfig: {
        facetId: 'entity-links',
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
      id: 'date-from',
      label: 'Dal',
      type: 'select',
      filterConfig: {
        facetId: 'date-from',
        searchIn: [{
          key: 'source.dateStart',
          operator: '>='
        }]
      } 
    }, {
      id: 'date-to',
      label: 'Al',
      type: 'select',
      filterConfig: {
        facetId: 'date-to',
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
