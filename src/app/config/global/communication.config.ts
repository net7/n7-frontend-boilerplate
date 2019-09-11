export default {
  defaultProvider: 'rest',
  onError: (error) => console.log('config error', error),
  providers: {
    apollo: {
      baseUrl: 'https://i-swat-apollo.piotrowicz.now.sh/',
      config: {
        'getLastPosts': `
        {
          getLastPosti(__PARAMS__) {
            id
            title
          }
        }
      `,
      }
    },
    rest: {
      baseUrl: "https://jsonplaceholder.typicode.com/"
    }
  }
};