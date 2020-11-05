export default {
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
        grid: null
      },
      {
        id: 'metadata',
        type: 'metadata',
        title: 'resource#metadata',
        readmore: {
          height: 100,
          labels: {
            more: 'resource#readmore',
            less: 'resource#readless'
          }
        }
      },
      {
        id: 'metadata-size',
        type: 'metadata',
        grid: null,
        title: 'resource#metadata_size'
      },
      {
        id: 'collection-continents',
        type: 'collection',
        grid: 3,
        title: 'resource#collection_continents'
      }
    ]
  }
};
