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
          img
          branches {
            label
            id
            icon
            img
            branches {
              label
              id
              icon
              img
            }
          }
        }
      }
    }
    `
  },
  'globalFilter': {
    queryName: 'globalFilter',
    queryBody: `{
      globalFilter(__PARAMS__){
        entitiesData {
          entity {
              id
              label
              typeOfEntity
          } count
        }
        typeOfEntityData {
          type
          count
        }
        itemsPagination {
          totalCount
          items {
            thumbnail
            item {
              id
              label
              info {
                  key
                  value

              }
            }
            relatedTypesOfEntity {
              type
              count
            }
          }
        }
      }
      }`
  },
  'getEntityDetails': {
    queryName: 'getEntity',
    queryBody: `{
      getEntity(__PARAMS__){
        overviewTab
        label
        id
        typeOfEntity
        fieldsTab {
          id
          label
          fields {
            key
            value
          }
        }
        extraTab
        wikiTab {
          text
          url
        }
        items {
          thumbnail
          item {
            label
            id
            info {
                key
                value
            }
          }
          relatedTypesOfEntity {
            type
            count
          }
        }
        entities {
          entity {
              id
              label
              typeOfEntity
          }
          count
        }
      }
    }
    `
  },
  'getItem': {
    queryName: 'getItem',
    queryBody: `{
      getItem(__PARAMS__){
          title
          text
          image
          icon
          items {
            thumbnail
              item {
                label
                icon
                info {
                  key
                  value
                }
              }
            relatedTypesOfEntity {
              count
              type
            }
          }
          connectedEntities {
            count
            entity{
             id
            label
            typeOfEntity
            }
          }
          fields {
            id
            label
            fields {
              id
              key
              value
            }
          }
          breadcrumbs {
            label
            link
          }
        }
      }`
  },
  'autoComplete': {
    queryName: 'autoComplete',
    queryBody: `{
      autoComplete(__PARAMS__){
        totalCount
        entities {
          entity {
              id
              label
              typeOfEntity
          }
          count
        }
      }
    }`
  },
  'search': {
    queryName: 'search',
    queryBody: `{
      search(__PARAMS__){
        totalCount
        facets
        filters
        results
        page
      }
    }`
  }
};
