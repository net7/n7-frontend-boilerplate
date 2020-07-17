export default {
  totalCount: 0,
  facets: [
    {
      id: 'query',
      type: 'value',
    },
    {
      id: 'query-all',
      type: 'value',
      hasStaticData: true,
      data: [
        {
          value: '1',
          label: 'Cerca in tutti i campi delle schede',
        },
      ],
    },
    {
      id: 'query-links',
      type: 'value',
    },
    {
      id: 'entity-types',
      type: 'value',
      operator: 'OR',
      limit: 10,
      order: 'count',
    },
    {
      id: 'entity-search',
      type: 'value',
    },
    {
      id: 'entity-links',
      type: 'value',
      searchData: ['entity-type'],
    },
  ],
  fields: [
    {
      inputs: [
        {
          type: 'text',
          facetId: 'query',
          placeholder: 'Cerca nei titoli delle schede',
          filterConfig: {
            delay: 500,
            minChars: 3,
            searchIn: [
              {
                key: 'label.ngrams',
                operator: 'LIKE',
              },
            ],
          },
        },
        {
          type: 'checkbox',
          facetId: 'query-all',
          filterConfig: {
            searchIn: [
              {
                key: 'label.ngrams^5,text^4,fields.*.label^3',
                operator: '=',
              },
            ],
          },
        },
        {
          type: 'link',
          facetId: 'query-links',
          filterConfig: {
            isArray: true,
            searchIn: [
              {
                key: 'source.entityType',
                operator: '=',
              },
            ],
          },
        },
      ],
    },
    {
      header: {
        label: 'Relazione con',
        classes: 'related-class',
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
                operator: '=',
              },
            ],
          },
        },
        {
          type: 'text',
          facetId: 'entity-search',
          placeholder: 'Cerca entità',
          filterConfig: {
            delay: 500,
            minChars: 3,
            context: 'internal',
            target: 'entity-links',
            searchIn: [
              {
                key: 'label',
                operator: 'LIKE',
              },
            ],
          },
        },
        {
          type: 'link',
          facetId: 'entity-links',
          emptyState: {
            label: 'La tua ricerca non ha dato risultati, prova a cambiare i filtri',
          },
          filterConfig: {
            isArray: true,
            limit: 20,
            pagination: {
              limit: 50,
              offset: 0
            },
            searchIn: [
              {
                key: 'relatedEntities.id',
                operator: '=',
              },
            ],
          },
        },
      ],
    },
  ],
  results: {
    order: { // Default Sorting Method
      type: 'text', // score | text | date
      key: 'label_sort', // docPath, elastic key, ecc
      direction: 'ASC' // ASC | DESC
    },
    fields: [
      {
        id: 'description',
        highlight: true,
        limit: 200,
      },
    ],
  },
  page: { offset: 0, limit: 10 },
};
