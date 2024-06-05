import { ConfigMurucaResourceLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
  title: 'Opera',
  type: 'work',
  sections: {
    top: [
      {
        id: 'header',
        type: 'title',
        grid: null,
      },
      {
        id: 'button',
        type: 'button',
        options: {
          text: 'Scarica PDF',
          link: '/pdf-download',
          iconRight: 'n7-icon-download'
        }
      }
    ],
    content: [
      {
        id: 'text-viewer',
        type: 'text',
        options: {
          enableListeners: true,
        }
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
