import gql from 'graphql-tag';

export const PRODUCT_DETAIL = gql`
  query GetProductDetail($id: String!) {
    product(id: $id) {
      ... on Product {
        productName
        productImageDisplay
        shopifyProduct
        upsellCollection(limit: 1) {
          items {
            ... on Product {
              shopifyHandle
              productDescription
              colorVariantsCollection(limit: 50) {
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
        informationalDropdownsCollection(limit: 10) {
          items {
            ... on InformationalDropdown {
              dropdownTitle
              dropdownBody {
                json
              }
            }
          }
        }
        colorVariantsCollection(limit: 10) {
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
              hexCode
              variantDescription {
                json
              }
              additionalDetailsCollection(limit: 5) {
                items {
                  ... on InformationalDropdown {
                    dropdownTitle
                    dropdownBody {
                      json
                    }
                    orderPriority
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
