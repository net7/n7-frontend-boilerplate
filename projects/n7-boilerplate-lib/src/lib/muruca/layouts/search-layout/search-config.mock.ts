import { SearchConfig } from '../search-facets-layout/search-facets-config';

const facets = {
  sections: [{
    header: {
      id: 'header-filtra',
      data: {
        text: 'Filtra i risultati'
      }
    },
    inputs: [{
      id: 'query',
      type: 'text',
      queryParam: true,
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
      id: 'header-toponimi',
      data: {
        text: 'Toponimi',
        additionalText: '786',
      }
    },
    inputs: [{
      id: 'input-toponimi-filter',
      type: 'text',
      schema: {
        valueType: 'string'
      },
      data: {
        id: 'input-text-01',
        placeholder: 'Search',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'input-toponimi',
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
      id: 'header-glossario',
      data: {
        text: 'Glossario',
        additionalText: '96',
      }
    },
    inputs: [{
      id: 'input-glossario-filter',
      type: 'text',
      schema: {
        valueType: 'string'
      },
      data: {
        id: 'input-text-02',
        placeholder: 'Search',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'input-glossario',
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
      id: 'header-continenti',
      data: {
        text: 'Continenti',
        additionalText: '3'
      }
    },
    inputs: [{
      id: 'input-continenti',
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
        iconRight: 'n7-icon-angle-right'
      }
    },
    inputs: [{
      id: 'input-keywords',
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
      id: 'header-data',
      data: {
        text: 'Data di pubblicazione',
        additionalText: '20',
        iconRight: 'n7-icon-angle-right'
      }
    },
    inputs: [{
      id: 'input-data',
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
      id: 'header-luogo',
      data: {
        text: 'Luogo di pubblicazione',
        additionalText: '15',
        iconRight: 'n7-icon-angle-right'
      }
    },
    inputs: [{
      id: 'input-luogo',
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
}));

const request = {
  results: {
    id: 'search',
    delay: 500
  },
  links: {
    id: 'links',
  },
  provider: 'rest',
  delay: 500
};

export default { request, facets, layoutInputs } as SearchConfig;
