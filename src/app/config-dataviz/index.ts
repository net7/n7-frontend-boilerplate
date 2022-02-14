import { ConfigCommonCommunication } from '@net7/boilerplate-common';
import layouts from './layouts';

const communication: ConfigCommonCommunication = {
  defaultProvider: 'rest-local',
  providers: {
    rest: {
      type: 'rest',
      baseUrl: '//jsonplaceholder.typicode.com/',
      config: {
        posts: 'posts',
      }
    },
    'rest-local': {
      type: 'rest',
      baseUrl: '//jsonplaceholder.typicode.com/',
      config: {
        posts: 'posts',
      }
    }
  }
};

export default {
  communication,
  ...layouts
};
