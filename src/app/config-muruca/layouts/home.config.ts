export default {
  title: 'Home',
  bodyClasses: 'has-transparent-header',
  sections: [
    {
      id: 'slider-main',
      type: 'slider',
      grid: null,
      options: {
        classes: 'n7-slider-main',
        background: true
      }
    },
    // {
    //   id: 'hero-main',
    //   type: 'hero',
    //   grid: null,
    //   options: {
    //     classes: 'n7-hero-main',
    //     background: true
    //   }
    // },
    // {
    //   id: 'collection-works',
    //   type: 'collection',
    //   grid: 4,
    //   options: {
    //     classes: 'is-vertical'
    //   }
    // },
    // {
    //   id: 'hero-books',
    //   type: 'hero',
    //   grid: null,
    //   options: {
    //     classes: 'n7-hero-books',
    //     background: false
    //   }
    // },
    /* {
      id: 'timeline-events',
      type: 'timeline',
      grid: null
    }, */
    // {
    //   id: 'collection-tours',
    //   type: 'collection',
    //   grid: 4,
    //   options: {
    //     classes: 'is-overlay'
    //   }
    // },
    {
      id: 'collection-news',
      type: 'collection',
      grid: 4,
      options: {
        classes: 'is-vertical'
      }
    },
  ]
};
