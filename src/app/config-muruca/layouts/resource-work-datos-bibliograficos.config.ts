export default {
  title: 'resource#page_bibliographic_data',
  tabs: 'obra',
  type: 'work',
  sections: {
    top: [
      {
        id: 'breadcrumbs',
        type: 'breadcrumbs'
      },
      {
        id: 'header',
        type: 'title'
      },
      {
        id: 'metadata',
        type: 'metadata'
      },
      {
        id: 'tab-bar',
        type: 'tabs'
      }
    ],
    content: [
      {
        id: 'button',
        type: 'button',
        options: {
          text: 'Scarica PDF',
          link: 'pdf-download',
          iconRight: 'n7-icon-download'
        }
      },
      {
        id: 'metadata-datos-bibliograficos',
        type: 'metadata',
        title: ''
      },
      {
        id: 'collection-bibliography',
        type: 'collection',
        grid: 3,
        title: ''
      }
    ]
  }
};
