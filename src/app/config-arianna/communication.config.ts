export default {
  defaultProvider: 'apollo',
  providers: {
    apollo: {
      baseUrl: 'https://aw-unifi-graphql.netseven.it/',
      // baseUrl: 'http://graphql.archiviodistatotrieste.it/'
    },
    rest: {
      baseUrl: 'https://jsonplaceholder.typicode.com/',
      defaultMethod: 'GET'
    }
  }
};
