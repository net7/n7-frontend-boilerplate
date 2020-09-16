export default {
  title: 'Opera > Metadati',
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
