export const ApolloProviderConfig = {
  'getLastPosts': `
    {
      getLastPosts(__PARAMS__) {
        id
        title
      }
    }
  `, 
  'getTestHero': `
    {
      getTestHero(__PARAMS__) {
        title
      }
    }
  `, 
  'getPosts': `
    {
      getPosts(__PARAMS__) {
        title
        description
      }
    }
  `, 
};