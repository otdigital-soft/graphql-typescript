import gql from 'graphql-tag';

export const SINGLE_COLLECTION = gql`
  query GetSingleCollection($collectionId: String!) {
    collectionCollection(where: { shopifyCollection: $collectionId }) {
      items {
        ... on Collection {
          name
          description
          coverImageHero {
            url
          }
        }
      }
    }
  }
`;

export const ALL_COLLECTIONS = gql`
  query {
    collectionCollection {
      items {
        ... on Collection {
          name
          slug
        }
      }
    }
  }
`;
