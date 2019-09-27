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
  'getTree': {
    queryName: 'getTreeOfItems',
    queryBody: `
    {
      getTreeOfItems(treeId: "patrimonioId" ) {
        id
        label
        icon
        branches {
          label
          id
          icon   
          branches {
            label
            id
            icon  
            branches {
              label
              id
              icon          
            }        
          }       
        }
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
  },
  'getItemDetails':{
    queryName: 'getItemDetails',
    queryBody:`{
        getItemDetails(__PARAMS__){
            title
            text
            subTitle
            image
            fields {
              id
              label
              fields {
                id
                key
                value
              }
            }
            item {
              id
            }
            breadcrumbs {
              label
              link
            }
          }
      }`
  }
};