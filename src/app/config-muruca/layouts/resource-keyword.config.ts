import { ConfigMurucaResourceLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
  title: 'Termini',
  type: 'keywords',
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
        id: 'collection-keywords',
        type: 'collection',
        grid: 3
      }
    ]
  }
};

export default config;
