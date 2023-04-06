import gql from 'graphql-tag';

const SINGLE_CATEGORY = gql`
  query GetCategory($urlSlug: String!) {
    categoryCollection(where: { slug: $urlSlug }) {
      items {
        sys {
          id
        }
        slug
        categoryTitle
        orderedCollectionsCollection {
          items {
            sys {
              id
            }
            ... on Collection {
              name
              slug
              description
              shopifyCollectionId
            }
          }
        }
      }
    }
  }
`;

export default SINGLE_CATEGORY;
