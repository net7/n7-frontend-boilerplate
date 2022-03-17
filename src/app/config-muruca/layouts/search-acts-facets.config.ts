import { MrSearchConfig } from '@net7/boilerplate-muruca';

const facets = {
  sections: [
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
    {
      id: 'section-query-locations',
      inputs: [{
        id: 'query-locations',
        type: 'text',
        queryParam: true,
        delay: 500,
        schema: {
          valueType: 'string'
        },
        data: {
          id: 'query-locations',
          placeholder: 'search#placeholder_query-locations',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon'
        }
      }]
    },
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
        limit: 500,
        queryParam: true,
        schema: {
          valueType: 'string',
          multiple: false,
        },
        initialize: true,
        libOptions: {
          center: [46.06, 11.21],
          zoom: 9,
          iconSize: [13, 20],
          maxClusterRadius: 10,
          disableClusteringAtZoom: 8,
          minZoom: 8,
          // maxZoom: 8,
          layerUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
        },
      }],
    }, {
      id: 'section-years',
      header: {
        id: 'header-years',
        data: {
          text: 'search#header_years',
          additionalText: null
        }
      },
      inputs: [{
        id: 'years',
        type: 'histogram',
        limit: 500,
        queryParam: true,
        schema: {
          valueType: 'string',
          multiple: false,
        },
        initialize: true,
      }],
    }, {
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
          type: 'number',
          min: 1000,
          placeholder: 'search#placeholder_date',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon'
        }
      }]
    },

    /* {
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
    }, */
    {
      id: 'section-language',
      header: {
        id: 'header-language',
        data: {
          text: 'search#header_language',
          additionalText: null,
          iconRight: 'n7-icon-angle-down'
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
    {
      id: 'section-editor',
      header: {
        id: 'header-editor',
        data: {
          text: 'search#header_editor',
          additionalText: null,
          iconRight: 'n7-icon-angle-down'
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
    {
      id: 'section-shelfmark',
      header: {
        id: 'header-shelfmark',
        data: {
          text: 'search#header_shelfmark',
          additionalText: null,
          iconRight: 'n7-icon-angle-down'
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
    },
    {
      id: 'section-specimen',
      header: {
        id: 'header-specimen',
        data: {
          text: 'search#header_specimen',
          additionalText: null,
          iconRight: 'n7-icon-angle-down'
        }
      },
      inputs: [{
        id: 'specimen',
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
