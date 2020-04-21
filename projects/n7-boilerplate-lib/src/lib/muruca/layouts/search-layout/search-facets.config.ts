import { SearchFacetsConfig } from '../search-facets-layout/search-facets-config';

const configuration: SearchFacetsConfig = {
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
      data: {
        links: [{
          text: 'Title',
          counter: 28,
          payload: 'i02t28'
        }, {
          text: 'Title',
          counter: 21,
          payload: 'i02t21'
        }, {
          text: 'Title',
          counter: 18,
          payload: 'i02t18'
        }, {
          text: 'Title',
          counter: 16,
          payload: 'i02t16'
        }, {
          text: 'Title',
          counter: 11,
          payload: 'i02t11'
        }, {
          text: 'Title',
          counter: 9,
          payload: 'i02t9'
        }, {
          text: 'Title',
          counter: 4,
          payload: 'i02t4'
        }]
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
      data: {
        links: [{
          text: 'Title',
          counter: 28,
          payload: 'i04t28'
        }, {
          text: 'Title',
          counter: 21,
          payload: 'i04t21'
        }, {
          text: 'Title',
          counter: 18,
          payload: 'i04t18'
        }, {
          text: 'Title',
          counter: 16,
          payload: 'i04t16'
        }, {
          text: 'Title',
          counter: 11,
          payload: 'i04t11'
        }, {
          text: 'Title',
          counter: 9,
          payload: 'i04t9'
        }, {
          text: 'Title',
          counter: 4,
          payload: 'i04t4'
        }]
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
      data: {
        links: [{
          text: 'Title',
          counter: 32,
        }, {
          text: 'Title',
          counter: 27,
        }, {
          text: 'Title',
          counter: 18,
        }]
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
    inputs: [],
  }, {
    header: {
      id: 'header-data',
      data: {
        text: 'Data di pubblicazione',
        additionalText: '20',
        iconRight: 'n7-icon-angle-right'
      }
    },
    inputs: [],
  }, {
    header: {
      id: 'header-luogo',
      data: {
        text: 'Luogo di pubblicazione',
        additionalText: '15',
        iconRight: 'n7-icon-angle-right'
      }
    },
    inputs: [],
  }],
  classes: 'facets-wrapper'
};

export default configuration;
