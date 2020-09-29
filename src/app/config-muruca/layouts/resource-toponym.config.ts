export default {
  title: 'Toponimi',
  type: 'toponym',
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
        id: 'metadata-description',
        type: 'metadata',
        grid: null,
        options: {
          hideLabels: true
        }
      },
      {
        id: 'metadata',
        type: 'metadata',
        grid: null
      },
      {
        id: 'collection-toponyms',
        type: 'collection',
        grid: 3,
        title: 'Toponimi'
      }
    ]
  }
};
