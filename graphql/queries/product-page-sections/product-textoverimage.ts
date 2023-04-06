import gql from 'graphql-tag';

export const PRODUCT_TEXT_OVER_IMAGE = gql`
  query GetProductTextOverImageSection($id: String!) {
    textOverImageSection(id: $id) {
      ... on TextOverImageSection {
        textOverImageSetsCollection {
          items {
            ... on TextImage {
              title
              subtitle
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;
