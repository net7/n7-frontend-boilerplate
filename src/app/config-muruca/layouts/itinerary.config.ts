import { ConfigMurucaItineraryLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaItineraryLayout = {
  title: 'global#itinerary',
  bodyClasses: 'resource-layout',
  sections: [
    {
      id: 'related_res',
      type: 'collection',
      grid: 1,
      title: 'itinerary#related_res_title',
      options: {
        classes: 'mr-item-preview-itinerary',
        itemPreview: {
          limit: null,
          striptags: false
        }
      }
    },
    // {
    //   id: 'gallery1',
    //   type: 'gallery',
    //   grid: 5
    // },
    // {
    //   id: 'gallery2',
    //   type: 'gallery',
    //   grid: 5
    // },
    // {
    //   id: 'collection-works',
    //   type: 'collection',
    //   grid: 3
    // },
    // {
    //   id: 'collection-places',
    //   type: 'collection',
    //   grid: 3
    // },
    // {
    //   id: 'collection-witnesses',
    //   type: 'collection',
    //   grid: 3
    // }
  ]
};

export default config;
