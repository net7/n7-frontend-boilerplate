import { ConfigMurucaSearchLayout } from '@net7/boilerplate-muruca';
import searchWitnessesFacetsConfig from './search-witnesses-facets.config';

const config: ConfigMurucaSearchLayout = {

  title: 'Testimoni',
  searchId: 'witness',
  searchConfig: searchWitnessesFacetsConfig,
  facetsTitle: 'search#facets_title',
  resourcePath: '/witness',
  totalResultsText: 'search#witnesses_total',
  filtersTitle: 'search#filters_title',
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

export default config;
