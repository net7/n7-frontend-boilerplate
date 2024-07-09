export default {
  title: 'resource#page_codicological_data',
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
        id: 'button',
        type: 'button',
        options: {
          text: 'Scarica PDF',
          link: 'pdf-download',
          iconRight: 'n7-icon-download'
        }
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
        id: 'metadata-datos-codicologicos',
        type: 'metadata'
      }
    ]
  }
};
