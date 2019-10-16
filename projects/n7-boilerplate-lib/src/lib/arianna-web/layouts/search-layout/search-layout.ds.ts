import { LayoutDataSource } from '@n7-frontend/core';
import { SearchService } from 'n7-boilerplate-lib/lib/common/services';

const SEARCH_CONFIG = {
  facets: [{
    id: 'entity-types', 
    type: 'value',
    operator: 'OR',
    data: [{
      value: 'people',
      label: 'Persone',
      count: 1,
    }, {
      value: 'places',
      label: 'Luoghi',
      count: 2,
    }, {
      value: 'concepts',
      label: 'Concetti',
      count: 3,
    }, {
      value: 'organizations',
      label: 'Organizzazioni',
      count: 4,
    }]
  }, {
    id: 'entity-links', 
    type: 'value',
    data: [{
      value: 'milano',
      label: 'Milano',
      count: 1,
      filterData: {
        text: 'Milano',
        entity: 'places'
      }
    }, {
      value: 'roma',
      label: 'Comune di Roma',
      count: 2,
      filterData: {
        text: 'Comune di Roma',
        entity: 'places'
      }
    }, {
      value: 'spazio',
      label: 'Spazio',
      count: 3,
      filterData: {
        text: 'Spazio',
        entity: 'concept'
      }
    }, {
      value: 'rodolfo-marna',
      label: 'Rodolfo Marna',
      count: 4,
      filterData: {
        text: 'Rodolfo Marna',
        entity: 'people'
      }
    }, {
      value: 'alighiero-boetti',
      label: 'Alighiero Boetti',
      count: 5,
      filterData: {
        text: 'Alighiero Boetti',
        entity: 'people'
      }
    }]
  }, {
    id: 'date-from',
    type: 'value',
    operator: 'OR',
    data: [{
      value: '1990',
      label: '1990',
      count: 1,
    }, {
      value: '1995',
      label: '1995',
      count: 2,
    }, {
      value: '1996',
      label: '1996',
      count: 3,
    }, {
      value: '2018',
      label: '2018',
      count: 4,
    }]
  }, {
    id: 'other-checks', 
    type: 'value',
    operator: 'OR',
    data: [1, 2, 3, 4].map(number => ({
      value: number,
      label: `Check #${number}`,
      count: number * 10,
    }))
  }],
  fields: [{
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
      icon: 'n7-icon-search',
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
          operator: '<='
        }]
      } 
    }, {
      id: 'other-checks',
      type: 'checkbox',
      filterConfig: {
        isArray: true,
        facetId: 'other-checks',
        searchIn: [{
          key: 'other',
          operator: '='
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

    this.search.add(SEARCH_ID, SEARCH_CONFIG);
    const searchModel = this.search.model(SEARCH_ID);
    this.one('facets-wrapper').update({ searchModel });
  }
}
