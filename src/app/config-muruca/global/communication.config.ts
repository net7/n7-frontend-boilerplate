import apolloConfig from './apollo.config';
import restConfig from './rest.config';

export default {
  defaultProvider: 'provider-rest',
  providers: {
    'provider-rest': {
      type: 'rest',
      baseUrl: 'https://api.github.com/',
      config: restConfig
    },
    'provider-apollo': {
      type: 'apollo',
      baseUrl: 'http://apollo-example.com',
      config: apolloConfig
    }
  }
};
