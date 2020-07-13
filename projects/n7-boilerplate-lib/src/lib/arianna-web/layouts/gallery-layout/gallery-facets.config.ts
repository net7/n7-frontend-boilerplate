export default {
  totalCount: 0,
  facets: [
    {
      id: 'query',
      type: 'value'
    },
    {
      id: 'query-all',
      type: 'value',
      hasStaticData: true,
      data: [
        {
          value: '1',
          label: 'Cerca in tutti i campi delle schede'
        }
      ]
    },
    {
      id: 'entity-types',
      type: 'value',
      operator: 'OR',
      limit: 10,
      order: 'count'
    },
    {
      id: 'entity-search',
      type: 'value'
    },
    {
      id: 'entity-links',
      type: 'value',
      searchData: ['entity-type']
    },
  ],
  fields: [
    {
      inputs: [
        {
          type: 'text',
          facetId: 'query',
          placeholder: 'Cerca nei titoli delle schede',
          // icon: 'n7-icon-search',
          filterConfig: {
            delay: 500,
            minChars: 3,
            searchIn: [
              {
                key: 'label.ngrams',
                operator: 'LIKE'
              }
            ]
          }
        },
        {
          type: 'checkbox',
          facetId: 'query-all',
          filterConfig: {
            searchIn: [
              {
                key: 'label.ngrams^5,text^4,fields.*^3',
                operator: '='
              }
            ]
          }
        },
      ]
    },
    {
      header: {
        label: 'Relazione con',
        classes: 'related-class'
      },
      inputs: [
        {
          type: 'checkbox',
          facetId: 'entity-types',
          filterConfig: {
            isArray: true,
            context: 'internal',
            target: 'entity-links',
            searchIn: [
              {
                key: 'searchData.entity-type',
                operator: '='
              }
            ]
          }
        },
        {
          type: 'text',
          facetId: 'entity-search',
          placeholder: 'Cerca entità',
          // icon: 'n7-icon-search',
          filterConfig: {
            delay: 500,
            minChars: 3,
            context: 'internal',
            target: 'entity-links',
            searchIn: [
              {
                key: 'label',
                operator: 'LIKE'
              }
            ]
          }
        },
        {
          type: 'link',
          facetId: 'entity-links',
          emptyState: {
            label: 'La tua ricerca non ha dato risultati, prova a cambiare i filtri'
          },
          filterConfig: {
            isArray: true,
            limit: 20,
            searchIn: [
              {
                key: 'relatedEntities.id',
                operator: '='
              }
            ]
          }
        }
      ]
    },
  ],
  results: {
    order: {
      type: 'score', // score | text | date
      key: '_score', // docPath, elastic key, ecc
      direction: 'DESC' // ASC | DESC
    },
    fields: [
      {
        id: 'description',
        highlight: true,
        limit: 200
      }
    ]
  },
  page: { offset: 0, limit: 12 }
};
