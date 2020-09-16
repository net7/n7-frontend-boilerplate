export default {
  title: 'Opera > Sandbox',
  tabs: 'work',
  type: 'work',
  sections: {
    top: [
      {
        id: 'breadcrumbs',
        type: 'breadcrumbs'
      },
      {
        id: 'header',
        type: 'title'
      },
      {
        id: 'tab-bar',
        type: 'tabs'
      }
    ],
    content: [
      {
        id: 'header',
        type: 'text'
      },
      {
        id: 'metadata',
        type: 'metadata'
      },
      {
        id: 'metadata-size',
        type: 'metadata',
        grid: null
      },
      {
        id: 'collection-continents',
        type: 'collection',
        grid: 3
      }
    ]
  }
};
