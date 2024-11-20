import { ConfigCommonCommunication } from '@net7/boilerplate-common';

const config: ConfigCommonCommunication = {
  defaultProvider: 'apollo',
  providers: {
    apollo: {
      type: 'apollo',
      // baseUrl: 'http://localhost:4000/',
      baseUrl: 'https://a4view.archivioflamigni.org/apollo/',

      // config is loaded through arianna-web core module
      // beacause all installations have the same config
      config: {},
    }
  }
};
export default config;
