export default {
  maxHeight: 100, // Threshold where the "read-more" button appears
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
        title: 'resource#metadata'
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
