import { ConfigCommonCommunication } from '@net7/boilerplate-common';
import layouts from './layouts';

const communication: ConfigCommonCommunication = {
  defaultProvider: 'rest-local',
  providers: {
    rest: {
      type: 'rest',
      baseUrl: 'https://jsonplaceholder.typicode.com/',
      config: {
        posts: 'posts',
      }
    },
    'rest-local': {
      type: 'rest',
      baseUrl: 'https://jsonplaceholder.typicode.com/',
      config: {
        posts: 'posts',
        post: 'posts/{id}',
        comments: 'posts/{id}/comments',
        dynamic: '{root}/{id}'
      }
    }
  }
};

export default {
  communication,
  ...layouts
};
