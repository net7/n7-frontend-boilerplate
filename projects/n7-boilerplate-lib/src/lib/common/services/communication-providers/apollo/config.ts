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
      getTreeOfItems{
        id
        label
        icon
        branches {
          label
          id
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
              fields
              {
                ...
                on KeyValueField {
                  key
                  value
                }
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
        fields {
          ...
          on KeyValueField {
            key
            value
          }
          ... on
          KeyValueFieldGroup {
            label
            fields
            {
              ...
              on KeyValueField {
                key
                value
              }
            }
          }
        }
        extraTab
        wikiTab {
          text
          url
        }
        relatedItems {
          thumbnail
          item {
            label
            id
            fields
            {
              ...
              on KeyValueField {
                key
                value
              }
            }
          }
          relatedTypesOfEntity {
            type
            count
          }
        }
        relatedEntities {
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
      getItem(__PARAMS__) {
        id
        label
        icon
        title
        subTitle
        image
        text
        fields {
          ...
          on KeyValueField {
            key
            value
          }
          ... on KeyValueFieldGroup {
            label
            fields {
              ...
              on KeyValueField {
                key
                value
              }
            }
          }
          }
          relatedEntities {
            count
            entity{
              id
              label
              typeOfEntity
            }
          }
          relatedItems {
            thumbnail
            item {
              label
              id
          }
          relatedTypesOfEntity {
            type
            count
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
              fields {
                ...
                on KeyValueField {
                  key
                  value
                }
                ... on
                KeyValueFieldGroup {
                  label
                  fields
                  {
                    ...
                    on KeyValueField {
                      key
                      value
                    }
                  }
                }
              }
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
