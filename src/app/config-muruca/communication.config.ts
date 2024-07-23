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
      baseUrl: 'https://sls.petrarcaonline.it/', // PETRARCA
      // baseUrl: 'http://cartetrentine-sls.muruca.cloud/', // CARTE TRENTINE
      // baseUrl: 'http://demosls.muruca.cloud/', // DEMO
      // baseUrl: 'http://localhost:3126/',
      config: {
        home: 'get_home',
        menu: 'get_menu',
        static: 'get_static/',
        post: 'get_static_post/',
        search: 'search/results',
        advancedSearch: 'advanced_search',
        advancedSearchOptions: 'advanced_search_options',
        posts: 'list/posts',
        facets: 'search/facets',
        searchDescription: 'get_search_description/',
        resource: 'get_resource',
        footer: 'get_footer',
        timeline: 'get_timeline/time-events',
        map: 'get_map/places',
        timelineDescription: 'get_search_description/timeline',
        itinerary: 'get_itinerary/',
        xmlSearch: 'search_text_hl/',
        getPdf: 'getPDF'
      }
    }
  }
};

export default config;
