export default {
  defaultProvider: 'apollo',
  providers: {
    apollo: {
      baseUrl: 'https://aw-unifi-graphql.netseven.it/'
    },
    rest: {
      baseUrl: 'https://jsonplaceholder.typicode.com/',
      defaultMethod: 'GET'
    }
  }
};
