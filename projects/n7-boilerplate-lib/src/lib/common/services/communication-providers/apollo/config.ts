export const ApolloProviderConfig = {
  'getLastPosts': {
    queryName: 'getLastPosts',
    queryBody: `
      {
        getLastPosts(__PARAMS__) {
          id
          title
        }
      }
    ` 
  }, 
  'getTestHero': {
    queryName: 'getTestHero',
    queryBody: `
      {
        getTestHero(__PARAMS__) {
          title
        }
      }
    `
  },
};