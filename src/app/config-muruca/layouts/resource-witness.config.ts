import { ConfigMurucaResourceLayout } from '@n7-frontend/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
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
        grid: null,
        readmore: {
          height: 150,
          labels: {
            more: 'readmore#more',
            less: 'readmore#less'
          }
        }
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
            limit: null,
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

export default config;
