import { CommunicationConfig } from '@n7-frontend/boilerplate';

const communication: CommunicationConfig = {
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

export default { communication };
