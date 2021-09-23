import { ConfigMurucaResourceLayout } from '@n7-frontend/boilerplate';

const config: ConfigMurucaResourceLayout = {
  title: 'Opera',
  type: 'work',
  sections: {
    top: [
      {
        id: 'header',
        type: 'title',
        grid: null
      }
    ],
    content: [
      {
        id: 'text-viewer',
        type: 'text'
      },
      {
        id: 'metadata',
        type: 'metadata',
        title: 'resource#metadata'
      },
      {
        id: 'collection-witnesses',
        type: 'collection',
        grid: 3,
        title: 'Testimoni collegati',
        options: {
          itemPreview: {
            linkTarget: '_blank'
          }
        }
      },
      {
        id: 'collection-taxonomies',
        type: 'collection',
        grid: 3,
        title: 'Tassonomie collegate'
      }
    ]
  }
};

export default config;
