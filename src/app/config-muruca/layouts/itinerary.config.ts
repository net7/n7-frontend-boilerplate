export default {
  title: 'global#itinerary',
  bodyClasses: 'resource-layout',
  sections: [
    {
      id: 'gallery1',
      type: 'gallery',
      grid: 5
    },
    {
      id: 'gallery2',
      type: 'gallery',
      grid: 5
    },
    {
      id: 'collection-bibliography',
      type: 'collection',
      grid: 1,
      title: 'Bibliografia',
      options: {
        classes: 'mr-item-preview-bibliography',
        itemPreview: {
          limit: 9999,
          striptags: false
        }
      }
    },
    {
      id: 'collection-works',
      type: 'collection',
      grid: 3
    },
    {
      id: 'collection-places',
      type: 'collection',
      grid: 3
    },
    {
      id: 'collection-witnesses',
      type: 'collection',
      grid: 3
    }
  ]
};
