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
  'globalFilter':{
    queryName: 'globalFilter',
    queryBody:`{
      globalFilter(__PARAMS__){
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
        itemsPagination {
          totalCount
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
      }
    }`
  },
  'getEntityDetails': {
    queryName: 'getEntityDetails',
    queryBody: `{
      getEntityDetails(__PARAMS__){
        entity {
          label
          id
        }
        fieldsTab {
          id
          fields {
            id
            key
            value
          }
        }
        entities {
          entity {
            id
            label
            typeOfEntity {
              id
              color
            }
          }
          count
        }
        items {
          breadcrumbs {
            link
            label
          }
          item {
            id
            label
          }
          thumbnail
          relatedTOEData {
            type {
              id
              label
              color
              icon
            }
            count
          }
        }
      }
    }
    `
  }
};