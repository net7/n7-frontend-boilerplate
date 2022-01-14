import { ConfigCommonCommunication } from '@n7-frontend/boilerplate';

const config: ConfigCommonCommunication = {
  defaultProvider: 'apollo',
  providers: {
    apollo: {
      type: 'apollo',
      // baseUrl: 'https://graphql-archivi.unifi.it/', // archivio di firenze
      // baseUrl: 'https://aw-unifi-graphql.netseven.it/', // dev server
      // baseUrl: 'http://asve-graphql.arianna4.cloud/', // archivio di venezia
      // baseUrl: 'http://graphql.archiviodistatotrieste.it/' // archivio di trieste
      // baseUrl: 'https://asve.arianna4.cloud/' // asve
      baseUrl: 'https://ariannaweb-matrice.netseven.it/',
      // config is loaded through arianna-web core module
      // beacause all installations have the same config
      config: {}
    }
  }
};
export default config;
