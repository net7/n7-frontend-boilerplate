import searchActsFacetsConfig from './search-acts-facets.config';

export default {
  title: 'Risultati della ricerca',
  searchId: 'act',
  searchConfig: searchActsFacetsConfig,
  resourcePath: '/atto',
  facetsTitle: 'search#facets_title',
  totalResultsText: 'search#acts_total',
  filtersTitle: 'search#filters_title',
  grid: 1,
  advancedResults: true,
  sort: {
    label: 'search#sort_title',
    options: [
      {
        value: null,
        label: 'search#sort_empty',
        selected: false,
      },
      {
        value: '_score',
        label: 'search#sort_score',
        selected: false,
        disabled: true
      },
      {
        value: 'sort_ASC',
        label: 'search#sort_asc',
        selected: false
      },
      {
        value: 'sort_DESC',
        label: 'search#sort_desc',
        selected: false
      }
    ]
  },
  pagination: {
    limit: 5,
    options: [
      12,
      24,
      48
    ]
  },
  itemPreview: {
    classes: 'is-vertical'
  },
  fallback: {
    text: 'search#fallback_text',
    button: 'search#fallback_button'
  },
  ko: {
    text: 'search#ko_text',
    button: 'search#ko_button'
  }
};
