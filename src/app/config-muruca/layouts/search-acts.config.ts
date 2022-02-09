import searchActsFacetsConfig from './search-acts-facets.config';

export default {
  title: 'Risultati della ricerca',
  searchId: 'act',
  searchConfig: searchActsFacetsConfig,
  resourcePath: '/atto',
  facetsTitle: 'search#facets_title',
  totalResultsText: 'search#acts_total',
  filtersTitle: 'search#filters_title',
  facetsWidthPercentage: 40,
  grid: 1,
  advancedResults: true,
  disableScroll: true,
  sort: {
    label: 'search#sort_title',
    options: [
      {
        value: 'date.year_ASC',
        label: 'search#sort_date_asc',
        selected: true
      },
      {
        value: 'date.year_DESC',
        label: 'search#sort_date_desc',
        selected: true
      },
      // {
      //   value: '_score',
      //   label: 'search#sort_score',
      //   selected: false,
      //   disabled: true
      // },
      {
        value: 'slug.keyword_ASC',
        label: 'search#sort_asc',
        selected: true
      },
      {
        value: 'slug.keyword_DESC',
        label: 'search#sort_desc',
        selected: true
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
