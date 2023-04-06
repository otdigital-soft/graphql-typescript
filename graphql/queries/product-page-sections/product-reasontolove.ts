import gql from 'graphql-tag';

export const PRODUCT_REASON_TO_LOVE = gql`
  query GetReasonToLove($id: String!) {
    carouselSection(id: $id) {
      ... on CarouselSection {
        sectionTitle
        sectionSubtitle
        textAndImageSetsCollection {
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
