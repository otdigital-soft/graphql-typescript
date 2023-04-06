import gql from 'graphql-tag';

const ALL_CATEGORIES = gql` 
query {
  categoryCollection {
    items {
      sys {
        id
      }
      slug
      categoryTitle
      orderedCollectionsCollection {
        items {
          ... on Collection {
            sys {
              id
            }
            name
            slug
            description
            shopifyCollectionId
          }
        }
      }
    }
  }
}`;

  export default ALL_CATEGORIES;