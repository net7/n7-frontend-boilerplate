export default {
  communication: {
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
  }
};
