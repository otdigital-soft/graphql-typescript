import gql from 'graphql-tag';

export const PRODUCT_REVIEW_SECTION = gql`
  query GetReviewSection($id: String!) {
    reviewSection(id: $id) {
      ... on ReviewSection {
        sectionTitle
        featuredReviewsCollection {
          items {
            ... on FeaturedReview {
              reviewerName
              reviewText {
                json
              }
              reviewStars
            }
          }
        }
        reviewImage {
          url
        }
      }
    }
  }
`;
