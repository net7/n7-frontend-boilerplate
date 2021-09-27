import { ConfigMurucaLayoutPosts } from '@n7-frontend/boilerplate';

const config: ConfigMurucaLayoutPosts = {
  searchId: 'posts',
  title: 'Lista Articoli',
  resourcePath: '/list/posts',
  totalResultsText: 'search#works_total',
  grid: 1,
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
  // itemPreview: {
  //   classes: 'is-vertical'
  // },
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
