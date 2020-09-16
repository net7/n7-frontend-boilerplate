export default {
  title: 'Opera > Facsimile',
  tabs: 'work',
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
        id: 'tab-bar',
        type: 'tabs'
      }
    ],
    content: [
      {
        id: 'image-viewer',
        type: 'viewer'
      },
      {
        id: 'metadata',
        type: 'metadata',
        title: 'resource#metadata'
      }
    ]
  }
};
