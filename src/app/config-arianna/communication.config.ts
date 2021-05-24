export default {
  defaultProvider: 'apollo',
  providers: {
    apollo: {
      // baseUrl: 'https://aw-unifi-graphql.netseven.it/', // dev server
      baseUrl: 'https://graphql-archivi.unifi.it/' // archivio di firenze
      // baseUrl: 'http://asve-graphql.arianna4.cloud/', // archivio di venezia
      // baseUrl: 'http://graphql.archiviodistatotrieste.it/' // archivio di trieste
      // baseUrl: 'https://asve.arianna4.cloud/' // asve
    },
    rest: {
      baseUrl: 'https://jsonplaceholder.typicode.com/',
      defaultMethod: 'GET'
    }
  }
};
