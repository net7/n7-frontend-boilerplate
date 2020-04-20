import { SearchFacetsConfig } from '../search-facets-layout/search-facets-config';

const configuration: SearchFacetsConfig = {
  sections: [{
    header: {
      text: 'Filtra i risultati'
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
      text: 'Toponimi',
      additionalText: '786',
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
        }, {
          text: 'Title',
          counter: 21,
        }, {
          text: 'Title',
          counter: 18,
        }, {
          text: 'Title',
          counter: 16,
        }, {
          text: 'Title',
          counter: 11,
        }, {
          text: 'Title',
          counter: 9,
        }, {
          text: 'Title',
          counter: 4,
        }]
      }
    }]
  }, {
    header: {
      text: 'Glossario',
      additionalText: '96',
    },
    inputs: [{
      id: 'input-03',
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
      id: 'input-04',
      type: 'link',
      data: {
        links: [{
          text: 'Title',
          counter: 28,
        }, {
          text: 'Title',
          counter: 21,
        }, {
          text: 'Title',
          counter: 18,
        }, {
          text: 'Title',
          counter: 16,
        }, {
          text: 'Title',
          counter: 11,
        }, {
          text: 'Title',
          counter: 9,
        }, {
          text: 'Title',
          counter: 4,
        }]
      }
    }]
  }, {
    header: {
      text: 'Continenti',
      additionalText: '3'
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
      text: 'Keywords',
      additionalText: '108',
      iconRight: 'n7-icon-angle-down'
    },
    inputs: [],
  }, {
    header: {
      text: 'Data di pubblicazione',
      additionalText: '20',
      iconRight: 'n7-icon-angle-down'
    },
    inputs: [],
  }, {
    header: {
      text: 'Luogo di pubblicazione',
      additionalText: '15',
      iconRight: 'n7-icon-angle-down'
    },
    inputs: [],
  }],
  classes: 'facets-wrapper'
};

export default configuration;
