import searchMapsFacetsConfig from './search-maps-facets.config';

export default {
  title: 'Mappe',
  searchId: 'map',
  searchConfig: searchMapsFacetsConfig,
  facetsTitle: 'search#facets_title',
  resourcePath: '/map',
  totalResultsText: 'search#maps_total',
  filtersTitle: 'search#filters_title',
  grid: 3,
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
    limit: 5,
    options: [
      12,
      24,
      48
    ]
  },
  itemPreview: {
    classes: 'is-vertical',
    limit: 200,
    striptags: true,
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
