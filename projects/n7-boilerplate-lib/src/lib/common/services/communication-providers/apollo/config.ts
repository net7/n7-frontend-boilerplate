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
  'globalFilter':{
    queryName: 'globalFilter',
    queryBody:`{
      globalFilter(__PARAMS__) {
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
              typeOfEntity {
                id
              }
            }
            count
          }
        }
        items {
          item {
            id
            label
            info {
              key
              value
            }
          }
          thumbnail
          relatedTOEData {
            type {
              id
              label
              icon
              color
            }
            count
          }
        }
      }
    }`
  }
};