export default {
  searchId: 'advanced_search',
  title: 'advancedsearch#page_title',
  resourcePath: '/work',
  totalResultsText: 'search#works_total',
  filters: {
    title: 'advancedsearch#filters_title',
    labels: {
      query: 'advancedsearch#query_label',
      author: 'advancedsearch#author_label',
      'checkbox-1': 'advancedsearch#checkbox_1',
      'select-1': 'advancedsearch#select_1'
    }
  },
  grid: 1,
  sort: {
    label: 'search#sort_title',
    options: [
      {
        value: '_score',
        label: 'search#sort_score',
        selected: false
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
