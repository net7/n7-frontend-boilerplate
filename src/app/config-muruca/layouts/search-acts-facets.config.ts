import { MrSearchConfig } from '@n7-frontend/boilerplate';

const facets = {
  sections: [
    // RICERCA PER PAROLE CHIAVE
    {
      id: 'section-query',
      inputs: [{
        id: 'query',
        type: 'text',
        queryParam: true,
        delay: 500,
        schema: {
          valueType: 'string'
        },
        data: {
          id: 'query',
          placeholder: 'search#placeholder_query',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon'
        }
      }]
    },
    // MAPPA
    {
      id: 'section-cadastralunits',
      header: {
        id: 'header-cadastralunits',
        data: {
          text: 'search#header_cadastralunits',
          additionalText: null
        }
      },
      inputs: [{
        id: 'cadastralunits',
        type: 'map',
        limit: 200,
        queryParam: true,
        schema: {
          valueType: 'string',
        },
        // data: {
        //   links: []
        // }
      }],
    },
    // LOCALIZZAZIONE
    // {
    //   id: 'section-cadastralunits',
    //   header: {
    //     id: 'header-cadastralunits',
    //     data: {
    //       text: 'search#header_cadastralunits',
    //       additionalText: null
    //     }
    //   },
    //   inputs: [{
    //     id: 'cadastralunits',
    //     type: 'link',
    //     limit: 200,
    //     queryParam: true,
    //     schema: {
    //       valueType: 'string',
    //       multiple: true
    //     },
    //     data: {
    //       links: []
    //     }
    //   }],
    // },
    // FORMATI
    {
      id: 'section-samples',
      header: {
        id: 'header-samples',
        data: {
          text: 'search#header_formats',
          additionalText: null
        }
      },
      inputs: [{
        id: 'samples',
        type: 'link',
        limit: 50,
        queryParam: true,
        schema: {
          valueType: 'string',
          multiple: true
        },
        data: {
          links: []
        }
      }],
    },
    // LINGUA
    {
      id: 'section-language',
      header: {
        id: 'header-language',
        data: {
          text: 'search#header_language',
          additionalText: null
        }
      },
      inputs: [{
        id: 'language',
        type: 'link',
        limit: 50,
        queryParam: true,
        schema: {
          valueType: 'string',
          multiple: true
        },
        data: {
          links: []
        }
      }],
    },
    // DATA | CERCA PER ANNO SPECIFICO
    {
      id: 'section-date-query',
      header: {
        id: 'header-date',
        data: {
          text: 'search#header_date',
          additionalText: null
        }
      },
      inputs: [{
        id: 'date_query',
        type: 'text',
        queryParam: true,
        delay: 500,
        schema: {
          valueType: 'string'
        },
        data: {
          id: 'date_query',
          placeholder: 'search#placeholder_date',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon'
        }
      }]
    },
    // {
    //   id: 'section-date',
    //   header: {
    //     id: 'header-date',
    //     data: {
    //       text: 'search#header_date',
    //       additionalText: null
    //     }
    //   },

    //   inputs: [
    //     {
    //       type: 'text',
    //       id: 'query-date',
    //       target: 'date',
    //       delay: 500,
    //       schema: {
    //         valueType: 'string'
    //       },
    //       data: {
    //         id: 'query-date',
    //         placeholder: 'search#placeholder_date',
    //         icon: 'n7-icon-search',
    //         inputPayload: 'search-input',
    //         enterPayload: 'search-enter',
    //         iconPayload: 'search-icon'
    //       }
    //     },
    //     {
    //     id: 'date',
    //     type: 'link',
    //     limit: 50,
    //     queryParam: true,
    //     schema: {
    //       valueType: 'string',
    //       multiple: true
    //     },
    //     data: {
    //       links: []
    //     }
    //   }],
    // },

    // REDATTORE DEL DOCUMENTO
    {
      id: 'section-editor',
      header: {
        id: 'header-editor',
        data: {
          text: 'search#header_editor',
          additionalText: null
        }
      },
      inputs: [
        {
          type: 'text',
          id: 'query-editor',
          target: 'editor',
          delay: 500,
          schema: {
            valueType: 'string'
          },
          data: {
            id: 'query-editor',
            placeholder: 'search#placeholder_editor',
            icon: 'n7-icon-search',
            inputPayload: 'search-input',
            enterPayload: 'search-enter',
            iconPayload: 'search-icon'
          }
        },
        {
          id: 'editor',
          type: 'link',
          limit: 50,
          queryParam: true,
          schema: {
            valueType: 'string',
            multiple: true
          },
          data: {
            links: []
          }
        }
      ],
    },
    // ARCHIVIO
    {
      id: 'section-shelfmark',
      header: {
        id: 'header-shelfmark',
        data: {
          text: 'search#header_shelfmark',
          additionalText: null
        }
      },
      inputs: [{
        id: 'shelfmark',
        type: 'link',
        limit: 50,
        queryParam: true,
        schema: {
          valueType: 'string',
          multiple: true
        },
        data: {
          links: []
        }
      }],
    }
  ],
  classes: 'facets-wrapper'
};

const layoutInputs = ['page', 'limit', 'sort'].map((id) => ({
  id,
  queryParam: true,
  schema: {
    valueType: id === 'sort' ? 'string' : 'number'
  }
}));

const request = {
  results: {
    id: 'search',
    delay: 500
  },
  facets: {
    id: 'facets',
  },
  provider: 'rest',
  delay: 500
};

export default { request, facets, layoutInputs } as MrSearchConfig;
