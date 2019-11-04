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
    queryName: 'getEntityDetails',
    queryBody: `{
      getEntityDetails(__PARAMS__){
        overviewTab
        entity {
          label
          id
          typeOfEntity {
            configKey
          }
        }
        fieldsTab {
          label
          fields {
            key
            value
          }
        }
        entities {
          entity {
            id
            label
            typeOfEntity {
              configKey
            }
          }
          count
        }
        extraTab
        wikiTab {
          text
          url
        }
        items {
          breadcrumbs {
            link
            label
          }
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
              configKey
            }
            count
          }
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
          subTitle
          image
           item {
            id
            icon
          }
          similarItems {
            thumbnail
              item {
                label
                icon
                info {
                  key
                  value
                }
              }
            relatedTOEData {
              count
              type {
                label
                configKey
              }
            }
          }
          connectedEntities {
            count
            entity{
             id
            label
              typeOfEntity {
                id
                label
                configKey
              }
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
  }
};
