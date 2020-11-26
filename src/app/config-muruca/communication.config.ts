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
      baseUrl: 'http://petrarca-sls.netseven.it/',
      // baseUrl: 'http://localhost:3126/',
      config: {
        home: 'get_home',
        menu: 'get_menu',
        static: 'get_static/',
        search: 'search/results',
        facets: 'search/facets',
        resource: 'get_resource',
        footer: 'get_footer'
      }
    }
  }
};
