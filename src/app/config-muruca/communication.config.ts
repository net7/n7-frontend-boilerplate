export default {
  defaultProvider: 'rest-local',
  providers: {
    rest: {
      type: 'rest',
      baseUrl: '//jsonplaceholder.typicode.com/',
      config: {
        sections: 'sections',
        search: 'posts',
        links: 'todos'
      }
    },
    'rest-local': {
      type: 'rest',
      // baseUrl: 'http://theatheor-sls.netseven.it/', // THEATHEOR
      baseUrl: 'http://petrarca-sls.netseven.it/', // PETRARCA
      // baseUrl: 'http://localhost:3124/',
      config: {
        home: 'get_home',
        menu: 'get_menu',
        static: 'get_static/',
        post: 'get_static_post/',
        search: 'search/results',
        advancedSearch: 'advanced_search',
        facets: 'search/facets',
        searchDescription: 'get_search_description/',
        resource: 'get_resource',
        footer: 'get_footer',
        timeline: 'get_timeline/time-events',
        timelineDescription: 'get_search_description/timeline',
      }
    }
  }
};
