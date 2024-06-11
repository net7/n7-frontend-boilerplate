import { ConfigMurucaResourceLayout } from '@net7/boilerplate-muruca';

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
        id: 'image-viewer',
        type: 'viewer',
        grid: 3,
        title: 'resource#image-viewer',
      },
      // {
      //   id: 'text-viewer',
      //   type: 'text',
      //   options: {
      //     enableListeners: true,
      //   }
      // },
      {
        id: 'metadata',
        type: 'metadata',
        title: 'resource#metadata'
      },
      // {
      //   id: 'collection-witnesses',
      //   type: 'collection',
      //   grid: 3,
      //   title: 'Testimoni collegati',
      //   options: {
      //     itemPreview: {
      //       linkTarget: '_blank'
      //     }
      //   }
      // },
      // {
      //   id: 'collection-taxonomies',
      //   type: 'collection',
      //   grid: 3,
      //   title: 'Tassonomie collegate'
      // }
    ]
  }
};

export default config;
