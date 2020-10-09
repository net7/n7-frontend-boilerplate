export default {
  title: 'Mappa',
  type: 'map',
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
      },
      {
        id: 'metadata',
        type: 'metadata'
      }
    ],
    content: [
      {
        id: 'image-viewer',
        type: 'viewer',
        grid: null
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
        title: 'Metadati',
        type: 'metadata',
        grid: null
      },
      {
        id: 'metadata-size',
        title: 'Dimensioni',
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
      },
      {
        id: 'collection-maps',
        type: 'collection',
        grid: 3,
        title: 'Second level maps',
        options: {
          classes: 'is-vertical'
        }
      },
      {
        id: 'collection-toponyms',
        title: 'Toponimi',
        type: 'collection',
        grid: null,
      },
      {
        id: 'collection-keywords',
        title: 'Keywords',
        type: 'collection',
        grid: null,
      }
    ]
  }
};
