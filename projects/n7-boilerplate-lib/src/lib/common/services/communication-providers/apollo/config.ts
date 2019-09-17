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
  'initialGlobalFilterCall':{
    queryName: 'globalFilter',
    queryBody:`{
      globalFilter {
        entitiesData {
            countData {
              type {
                id
                label
                color
                icon
              }
              count
            }
          entitiesCountData {
            entity {
              id
              label
            }
            count
          }
          }
        }
      }`
  }
};