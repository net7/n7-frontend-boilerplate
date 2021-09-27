import { MrSearchConfig, MrSearchFacetsConfig } from '@n7-frontend/boilerplate';
import { MrSearchLayoutInput } from 'dist/n7-boilerplate-lib/public-api';

const facets: MrSearchFacetsConfig = {
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
  },
  {
    id: 'section-types',
    header: {
      id: 'header-types',
      data: {
        text: 'search#header_types',
        additionalText: null,
        iconRight: 'n7-icon-angle-down'
      }
    },
    inputs: [{
      id: 'types',
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
    valueType: id === 'sort' ? 'string' : 'boolean'
  }
} as MrSearchLayoutInput));

const request = {
  results: {
    id: 'search',
    delay: 500
  },
  facets: {
    id: 'facets',
    delay: 500
  },
  provider: 'rest',
};

const config: MrSearchConfig = {
  request,
  facets,
  layoutInputs
};

export default config;
