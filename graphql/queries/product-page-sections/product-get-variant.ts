import gql from 'graphql-tag';

export const GET_VARIANT_BY_SKU = gql`
  query GetVariantBySKU($sku: String!) {
    variantCollection(where: { shopifyVariantId: $sku }) {
      items {
        color
        shopifyVariantId
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
        hexCode
        variantDescription {
          json
        }
      }
    }
  }
`;
