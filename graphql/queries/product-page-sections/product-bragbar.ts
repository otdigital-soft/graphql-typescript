import gql from 'graphql-tag';

export const PRODUCT_BRAGBAR_SECTION = gql`
  query GetBragBarSection($id: String!) {
    bragBar(id: $id) {
      ... on BragBar {
        assetsCollection {
          items {
            ... on LogoOrIcon {
              url
              asset {
                url
              }
            }
          }
        }
      }
    }
  }
`;
