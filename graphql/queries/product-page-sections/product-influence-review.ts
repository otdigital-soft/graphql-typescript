import gql from 'graphql-tag';

export const PRODUCT_INFLUENCE_REVIEW = gql`
  query GetInfluenceReviewSection($id: String!) {
    influencerReview(id: $id) {
      ... on InfluencerReview {
        influencerPhoto {
          url
        }
        reviewText {
          json
        }
        influencerName
      }
    }
  }
`;
