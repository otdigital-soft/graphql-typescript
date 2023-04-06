import gql from 'graphql-tag';

const SINGLE_PRODUCT = gql`
  query GetSingleProduct($productId: String!) {
    productCollection(limit: 1, where: { shopifyProduct: $productId }) {
      items {
        ... on Product {
          shopifyProduct
          productName
          colorVariantsCollection {
            items {
              ... on Variant {
                imageCollection {
                  image1
                  image2
                  image3
                  image4
                  image5
                  image6
                  image7
                  image8
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default SINGLE_PRODUCT;
