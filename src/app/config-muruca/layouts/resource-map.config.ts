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
        // title: 'Descrizione',
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
        title: 'Second level maps'
      },
      {
        id: 'collection-toponyms',
        title: 'Toponimi',
        type: 'collection',
        grid: null,
      },
    ]
  }
};
