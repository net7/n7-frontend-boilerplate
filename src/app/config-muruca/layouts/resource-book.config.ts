export default {
  title: 'Libro',
  type: 'book',
  bodyClasses: 'resource-layout',
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
        id: 'image-viewer',
        type: 'viewer',
        grid: 3,
        title: 'resource#image-viewer',
      },
      {
        id: 'image-viewer-tools',
        type: 'viewer-tools',
        grid: 3,
        title: 'resource#image-viewer',
      },
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
            limit: false,
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
