import gql from 'graphql-tag';

export const IN_CART_UPSELL = gql`
  query {
    inCartUpsellCollection(limit: 1) {
      items {
        ... on InCartUpsell {
          titleOptional
          upsellProductsCollection(limit: 5) {
            items {
              ... on Product {
                productName
                shopifyProduct
                colorVariantsCollection(limit: 30) {
                  items {
                    ... on Variant {
                      color
                      shopifyVariant
                      imageCollection {
                        variantImagesCollection(limit: 20) {
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
  }
`;
