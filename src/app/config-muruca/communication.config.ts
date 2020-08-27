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
      baseUrl: 'http://unus-sls.netseven.it/',
      config: {
        home: 'get_home',
        menu: 'get_menu',
        static: 'get_static/',
        search: 'search/results',
        facets: 'search/facets',
        resource: 'get_resource'
      }
    }
  }
};
