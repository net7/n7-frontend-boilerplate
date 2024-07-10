// Tab per Metadata Dynamic Accordion (sls Theatheor/Auteso con mock resource)

export default {
  title: 'resource#page_codicological_data',
  tabs: 'obra',
  type: 'work',
  sections: {
    top: [
      // {
      //   id: 'breadcrumbs',
      //   type: 'breadcrumbs'
      // },
      {
        id: 'header',
        type: 'title'
      },
      // {
      //   id: 'metadata',
      //   type: 'metadata'
      // },
      {
        id: 'tab-bar',
        type: 'tabs'
      }
    ],
    content: [
      {
        id: 'metadata-dettaglio',
        type: 'metadata-dynamic',
        options: {
          accordion: true,
          dynamic: true
        }
      }
    ]
  }
};
