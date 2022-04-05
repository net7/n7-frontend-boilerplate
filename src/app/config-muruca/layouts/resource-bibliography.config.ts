import { ConfigMurucaResourceLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
  title: 'Bibliografia',
  type: 'book',
  sections: {
    top: [
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
        id: 'collection-works',
        type: 'collection',
        grid: 3
      }
    ]
  }
};

export default config;
