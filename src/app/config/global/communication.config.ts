// import { ApolloProviderConfig } from 'n7-boilerplate-lib';

/* const customApolloConfig = {
  ...ApolloProviderConfig,
  'getLastPosts': `
  {
    getLastPosti(__PARAMS__) {
      id
      title
    }
  }
  `,
}; */

export default {
  defaultProvider: 'apollo',
  providers: {
    apollo: {
      baseUrl: 'https://n7-ariannaweb-graphql-git-develop.net7.now.sh/',
      // config: customApolloConfig
    },
    rest: {
      baseUrl: "https://jsonplaceholder.typicode.com/",
      defaultMethod: 'GET',
    }
  }
};