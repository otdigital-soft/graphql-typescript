import gql from 'graphql-tag';

export const PRODUCT_YOU_MAY_ALSO_LIKE = gql`
  query GetYouMayAlsoLikeSectoin($id: String!) {
    youMayAlsoLikeSection(id: $id) {
      ... on YouMayAlsoLikeSection {
        sectionTitle
        sectionSubtitle
        recommendedProductsCollection(limit: 3) {
          items {
            ... on Product {
              shopifyHandle
              productName
              colorVariantsCollection(limit: 30) {
                items {
                  ... on Variant {
                    color
                    shopifyVariant
                    imageCollection {
                      variantImagesCollection {
                        items {
                          url
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
    }
  }
`;
