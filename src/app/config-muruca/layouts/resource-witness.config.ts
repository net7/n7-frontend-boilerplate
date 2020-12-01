export default {
  title: 'Testimoni',
  type: 'witness',
  sections: {
    top: [
      {
        id: 'breadcrumbs',
        type: 'breadcrumbs',
        options: {
          base: [{
            title: 'global#home',
            link: '/'
          }, {
            title: 'global#maps',
            link: '/maps'
          }]
        }
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
        // title: 'Metadati',
        grid: null
      },
      {
        id: 'metadata-size',
        type: 'metadata',
        grid: null
      },
      {
        id: 'collection-bibliography',
        type: 'collection',
        grid: 1,
        title: 'Bibliografia',
        options: {
          classes: 'mr-item-preview-bibliography',
          itemPreview: {
            limit: 9999,
            striptags: false
          }
        }
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
