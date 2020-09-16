import { MrSearchConfig } from 'n7-boilerplate-lib';

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
    id: 'section-toponyms',
    header: {
      id: 'header-toponyms',
      data: {
        text: 'search#header_toponyms',
        additionalText: null,
      }
    },
    inputs: [{
      id: 'toponyms-filter',
      type: 'text',
      delay: 500,
      target: 'toponyms',
      schema: {
        valueType: 'string'
      },
      data: {
        id: 'toponyms-filter',
        placeholder: 'search#placeholder_toponyms',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'toponyms',
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
    }]
  }, {
    id: 'section-continents',
    header: {
      id: 'header-continents',
      data: {
        text: 'search#header_continents',
        additionalText: null
      }
    },
    inputs: [{
      id: 'continents',
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
    }]
  }, {
    id: 'section-authors',
    header: {
      id: 'header-authors',
      data: {
        text: 'search#header_authors',
        additionalText: null
      }
    },
    inputs: [{
      id: 'authors',
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
    }]
  }, {
    id: 'section-keywords',
    header: {
      id: 'header-keywords',
      data: {
        text: 'search#header_keywords',
        additionalText: null,
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'keywords',
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
  }/* , {
    id: 'section-date',
    header: {
      id: 'header-date',
      data: {
        text: 'search#header_date',
        additionalText: null,
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'date',
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
    id: 'section-place',
    header: {
      id: 'header-place',
      data: {
        text: 'search#header_place',
        additionalText: null,
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'place',
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
  } */],
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
