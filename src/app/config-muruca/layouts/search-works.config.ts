import searchWorksFacetsConfig from './search-works-facets.config';

export default {
  title: 'Opere',
  searchId: 'work',
  searchConfig: searchWorksFacetsConfig,
  resourcePath: '/work',
  facetsTitle: 'search#facets_title',
  totalResultsText: 'search#works_total',
  filtersTitle: 'search#filters_title',
  // grid: 1,
  sort: {
    label: 'search#sort_title',
    options: [
      {
        value: '_score',
        label: 'search#sort_score',
        selected: false,
        disabled: true
      },
      {
        value: 'sort_ASC',
        label: 'search#sort_asc',
        selected: true
      },
      {
        value: 'sort_DESC',
        label: 'search#sort_desc',
        selected: false
      }
    ]
  },
  pagination: {
    selectLabel: 'search#pagination_select_label',
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
