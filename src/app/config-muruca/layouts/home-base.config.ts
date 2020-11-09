export default {
  title: 'Home',
  sections: [
    {
      id: 'hero-main',
      type: 'hero',
      grid: null,
      options: {
        classes: 'n7-hero-main',
        background: true
      }
    },
    {
      id: 'content-main',
      type: 'content',
    },
    {
      id: 'collection-continents',
      type: 'collection',
      grid: 4,
      options: {
        classes: 'is-overlay'
      }
    },
    {
      id: 'hero-works',
      type: 'hero',
      grid: null,
      options: {
        classes: 'n7-hero-works',
        background: false
      }
    },
    {
      id: 'collection-works',
      type: 'collection',
      grid: 4,
      options: {
        classes: 'is-vertical',
        itemPreview: {
          limit: 100
        }
      }
    }
  ]
};
