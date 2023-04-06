import gql from 'graphql-tag';

const PRODUCT_PAGE_COLLECTION = gql`
  query GetPageCollection($urlSlug: String!) {
    productDetailPageCollection(limit: 20, where: { urlSlug: $urlSlug }) {
      items {
        productName
        urlSlug
        product {
          ... on Product {
            sys {
              id
            }
          }
        }
        textOverImageSection {
          ... on TextOverImageSection {
            sys {
              id
            }
          }
        }
        bragBar {
          ... on BragBar {
            sys {
              id
            }
          }
        }
        emailSignupSection {
          sys {
            id
          }
        }
        reviewSection {
          ... on ReviewSection {
            sys {
              id
            }
          }
        }
        footer {
          ... on Footer {
            sys {
              id
            }
          }
        }
        emailSignupSection {
          ... on EmailSignupSection {
            sys {
              id
            }
          }
        }
        productRecommendationSection {
          ... on YouMayAlsoLikeSection {
            sys {
              id
            }
          }
        }
        faqSection {
          ... on FaqSection {
            sys {
              id
            }
          }
        }
        influencerReviewSection {
          ... on InfluencerReview {
            sys {
              id
            }
          }
        }
        reasonsToLoveSection {
          ... on CarouselSection {
            sys {
              id
            }
          }
        }
        textImageSection {
          ... on TextImageSection {
            sys {
              id
            }
          }
        }
        productRecommendationSection {
          ... on YouMayAlsoLikeSection {
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

export default PRODUCT_PAGE_COLLECTION;
