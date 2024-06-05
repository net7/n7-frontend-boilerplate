import { ConfigMurucaResourceLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaResourceLayout = {
  title: 'Libro',
  type: 'book',
  bodyClasses: 'resource-layout',
  sections: {
    top: [
      {
        id: 'breadcrumbs',
        type: 'breadcrumbs',
        options: {
          base: [
            {
              title: 'global#home',
              link: '/',
              routeId: 'home',
            },
            {
              title: 'global#maps',
              link: '/maps',
              routeId: 'maps',
            },
          ],
        },
      },
      {
        id: 'header',
        type: 'title',
      },
      {
        id: 'button',
        type: 'button',
        options: {
          text: 'Scarica PDF',
          link: '/pdf-download',
          iconRight: 'n7-icon-download'
        }
      },
    ],
    content: [
      {
        id: 'image-viewer',
        type: 'viewer',
        grid: 3,
        title: 'resource#image-viewer',
      },
      // {
      //   id: 'image-viewer-tools',
      //   type: 'viewer-tools',
      //   grid: 3,
      //   title: 'resource#image-viewer',
      // },
      {
        id: 'metadata-description',
        type: 'metadata',
        grid: null,
        options: {
          hideLabels: true,
        },
      },
      {
        id: 'metadata',
        type: 'metadata',
        // title: 'Metadati',
        grid: null,
      },
      {
        id: 'metadata-size',
        type: 'metadata',
        grid: null,
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
            striptags: false,
          },
        },
      },
      {
        id: 'collection-works',
        type: 'collection',
        grid: 3,
      },
      {
        id: 'collection-continents',
        type: 'collection',
        grid: 3,
      },
    ],
  },
};

export default config;
