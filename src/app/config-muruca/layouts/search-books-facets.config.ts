import { MrSearchConfig } from '@n7-frontend/boilerplate';

const facets = {
  sections: [{
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
  }, {
    id: 'section-libraries',
    header: {
      id: 'header-libraries',
      data: {
        text: 'search#header_libraries',
        additionalText: null
      }
    },
    inputs: [{
      id: 'libraries',
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
  }, {
    id: 'section-cities',
    header: {
      id: 'header-cities',
      data: {
        text: 'search#header_cities',
        additionalText: null
      }
    },
    inputs: [{
      id: 'cities',
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
  // {
  //   id: 'section-signatures',
  //   header: {
  //     id: 'header-signatures',
  //     data: {
  //       text: 'search#header_signatures',
  //       additionalText: null,
  //
  //     }
  //   },
  //   inputs: [{
  //     id: 'signatures',
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
  {
    id: 'section-dates',
    header: {
      id: 'header-dates',
      data: {
        text: 'search#header_dates',
        additionalText: null
      }
    },
    inputs: [{
      id: 'dates',
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
  // {
  //   id: 'section-contents',
  //   header: {
  //     id: 'header-contents',
  //     data: {
  //       text: 'search#header_contents',
  //       additionalText: null,
  //       iconRight: 'n7-icon-angle-down'
  //     }
  //   },
  //   inputs: [{
  //     id: 'contents',
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
  // {
  //   id: 'section-origins',
  //   header: {
  //     id: 'header-origins',
  //     data: {
  //       text: 'search#header_origins',
  //       additionalText: null,
  //       iconRight: 'n7-icon-angle-down'
  //     }
  //   },
  //   inputs: [{
  //     id: 'origins',
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
  // }
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

export default { request, facets, layoutInputs } as unknown as MrSearchConfig;
