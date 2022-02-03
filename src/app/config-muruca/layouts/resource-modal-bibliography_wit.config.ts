import { ConfigMurucaResourceLayout } from '@n7-frontend/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
  title: 'Testimoni',
  type: 'bibliography_wit',
  sections: {
    top: [
      {
        id: 'header',
        type: 'title'
      }
    ],
    content: [
      {
        id: 'collection-witnesses',
        type: 'collection',
        grid: 1,
        title: 'resource#collection_witnesses'
      },
    ]
  }
};

export default config;
