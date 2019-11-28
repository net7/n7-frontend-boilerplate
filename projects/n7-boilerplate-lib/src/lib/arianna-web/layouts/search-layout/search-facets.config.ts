export default {
  totalCount: 0,
  facets: [{
    id: 'query', 
    type: 'value'
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
    operator: 'OR',
    limit: 10,
    order: 'count', // count | text
    data: []
  }, {
    id: 'entity-search', 
    type: 'value'
  }, {
    id: 'entity-links', 
    type: 'value',
    metadata: ['title', 'entity-type'],
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
        isArray: true,
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
          key: 'entity-type',
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
          key: 'title',
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
  results: {
    order: {
      type: 'score', // score | text | date
      key: 'author', // docPath, elastic key, ecc
      direction: 'DESC', // ASC | DESC
    }, 

    // FIXME: collegare API
    // e controllare nuovo formato results.fields
    fields: [{
      id: 'title',
      highlight: true,
      limit: 50,
    }]
  },
  page: { offset: 0, limit: 10 }
}