import { SearchConfig } from '../search-facets-layout/search-facets-config';

function getLinks(prefix) {
  let i;
  const limit = Math.round(Math.random() * 10);
  const links = [];
  for (i = 0; i < limit; i += 1) {
    const text = `${prefix} ${i + 1}`;
    links.push({
      text,
      counter: Math.round(Math.random() * 100),
      payload: text
    });
  }
  return links;
}

const facets = {
  sections: [{
    header: {
      id: 'header-filtra',
      data: {
        text: 'Filtra i risultati'
      }
    },
    inputs: [{
      id: 'input-00',
      type: 'text',
      queryParam: true,
      data: {
        id: 'input-text-00',
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
      id: 'input-01',
      type: 'text',
      data: {
        id: 'input-text-01',
        placeholder: 'Search',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'input-02',
      type: 'link',
      queryParam: true,
      data: {
        links: getLinks('Toponimo')
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
      id: 'input-03',
      type: 'text',
      data: {
        id: 'input-text-02',
        placeholder: 'Search',
        icon: 'n7-icon-search',
        inputPayload: 'search-input',
        enterPayload: 'search-enter',
        iconPayload: 'search-icon',
      }
    }, {
      id: 'input-04',
      type: 'link',
      queryParam: true,
      data: {
        links: getLinks('Concetto')
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
      id: 'input-05',
      type: 'link',
      queryParam: true,
      data: {
        links: getLinks('Continente')
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
      id: 'input-06',
      type: 'link',
      queryParam: true,
      data: {
        links: getLinks('Keyword')
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
      id: 'input-07',
      type: 'link',
      queryParam: true,
      data: {
        links: getLinks('Data')
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
      id: 'input-08',
      type: 'link',
      queryParam: true,
      data: {
        links: getLinks('Luogo')
      }
    }],
  }],
  classes: 'facets-wrapper'
};

const layoutInputs = ['page', 'limit', 'sort'].map((id) => ({
  id,
  queryParam: true,
}));

const request = { id: 'search', delay: 500 };

export default { request, facets, layoutInputs } as SearchConfig;
