import { ApolloProviderConfig } from 'n7-boilerplate-lib';

const customApolloConfig = {
  ...ApolloProviderConfig,
  'getLastPosts': `
  {
    getLastPosti(__PARAMS__) {
      id
      title
    }
  }
  `,
};

export default {
  defaultProvider: 'apollo',
  onError: (error) => console.log('config error', error),
  providers: {
    apollo: {
      baseUrl: 'https://i-swat-apollo.piotrowicz.now.sh/',
      config: customApolloConfig
    },
    rest: {
      baseUrl: "https://jsonplaceholder.typicode.com/",
      defaultMethod: 'GET',
    }
  }
};