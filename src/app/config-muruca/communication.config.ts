import { ConfigCommonCommunication } from '@net7/boilerplate-common';

const config: ConfigCommonCommunication = {
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
      // baseUrl: 'https://theatheor-sls.netseven.it/', // THEATHEOR/AUTESO
      // baseUrl: 'https://sls.petrarcaonline.it/', // PETRARCA
      // baseUrl: 'http://cartetrentine-sls.muruca.cloud/', // CARTE TRENTINE
      // baseUrl: 'http://demosls.muruca.cloud/', // DEMO
      // baseUrl: 'http://localhost:3126/',
      baseUrl: 'http://localhost:3000/',
      config: {
        home: 'prod/get_home',
        // home: 'get_home',
        menu: 'prod/get_menu',
        // menu: 'get_menu',
        static: 'prod/get_static/',
        // static: 'get_static/',
        search: 'prod/search/results',
        // search: 'search/results',
        advancedSearch: 'prod/advanced_search',
        // advancedSearch: 'advanced_search',
        facets: 'prod/search/facets',
        // facets: 'search/facets',
        resource: 'prod/get_resource',
        // resource: 'get_resource',
        footer: 'prod/get_footer',
        // footer: 'get_footer',
        translation: 'get_translation/',
        xmlSearch: 'search_text_hl/',
        getPdf: 'getPDF'
      }
    }
  }
};

export default config;
