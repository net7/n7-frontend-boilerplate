import { ConfigMurucaResourceLayout } from '@n7-frontend/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
  title: 'Toponimi',
  type: 'toponym',
  sections: {
    top: [],
    content: [
      {
        id: 'header',
        type: 'title',
        grid: null
      },
      {
        id: 'metadata',
        type: 'metadata',
        grid: null
      },
      {
        id: 'collection-toponyms',
        type: 'collection',
        grid: 3
      }
    ]
  }
};

export default config;
