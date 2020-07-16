import { SearchConfig } from '../../interfaces/search.interface';

const facets = {
  sections: [{
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
        placeholder: 'Cerca nei titoli',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon'
      }
    }]
  }, {
    header: {
      id: 'header-toponyms',
      data: {
        text: 'Toponimi',
        additionalText: '786',
      }
    },
    inputs: [{
      id: 'toponyms-filter',
      type: 'text',
      delay: 500,
      schema: {
        valueType: 'string'
      },
      data: {
        id: 'text-01',
        placeholder: 'Search',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'toponyms',
      type: 'link',
      queryParam: true,
      schema: {
        valueType: 'string',
        // multiple: true
      },
      data: {
        links: []
      }
    }]
  }, {
    header: {
      id: 'header-glossary',
      data: {
        text: 'Glossario',
        additionalText: '96',
      }
    },
    inputs: [{
      id: 'glossary-filter',
      type: 'text',
      delay: 500,
      schema: {
        valueType: 'string'
      },
      data: {
        id: 'text-02',
        placeholder: 'Cerca',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'glossary',
      type: 'link',
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
    header: {
      id: 'header-continents',
      data: {
        text: 'Continenti',
        additionalText: '3'
      }
    },
    inputs: [{
      id: 'continents',
      type: 'link',
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
    header: {
      id: 'header-keywords',
      data: {
        text: 'Keywords',
        additionalText: '108',
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'keywords',
      type: 'link',
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
    header: {
      id: 'header-date',
      data: {
        text: 'Data di pubblicazione',
        additionalText: '20',
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'date',
      type: 'link',
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
    header: {
      id: 'header-place',
      data: {
        text: 'Luogo di pubblicazione',
        additionalText: '15',
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'place',
      type: 'link',
      queryParam: true,
      schema: {
        valueType: 'string',
        multiple: true
      },
      data: {
        links: []
      }
    }],
  }],
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

export default { request, facets, layoutInputs } as SearchConfig;
