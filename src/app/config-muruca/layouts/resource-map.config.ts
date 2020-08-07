export default {
  title: 'Mappa',
  type: 'map',
  sections: {
    top: [
      {
        id: 'breadcrumbs',
        type: 'breadcrumbs'
      },
      {
        id: 'header',
        type: 'title'
      }
    ],
    content: [
      {
        id: 'metadata-description',
        type: 'metadata',
        grid: null,
        options: {
          hideLabels: true
        }
      },
      {
        id: 'metadata',
        type: 'metadata',
        grid: null
      },
      {
        id: 'metadata-size',
        type: 'metadata',
        grid: null
      },
      {
        id: 'collection-works',
        type: 'collection',
        grid: 3
      },
      {
        id: 'collection-continents',
        type: 'collection',
        grid: 3
      }
    ]
  }
};
