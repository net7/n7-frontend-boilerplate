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
        title: 'Metadati'
      },
      {
        id: 'metadata-size',
        type: 'metadata',
        grid: null,
        title: 'Dimensioni'
      },
      {
        id: 'collection-continents',
        type: 'collection',
        grid: 3,
        title: 'Collezione di appartenenza'
      }
    ]
  }
};
