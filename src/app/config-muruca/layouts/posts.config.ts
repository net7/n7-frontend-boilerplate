export default {
  searchId: 'posts',
  title: 'Lista Articoli',
  resourcePath: '/list/posts',
  totalResultsText: 'search#works_total',
  filters: {
    title: 'posts#filters_title',
    labels: {
      query: 'posts#query_label',
      author: 'posts#author_label',
      'checkbox-1': 'posts#checkbox_1',
      'select-1': 'posts#select_1'
    }
  },
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
  itemPreview: {
    // classes: 'is-vertical'
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
