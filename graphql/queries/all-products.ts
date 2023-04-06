import gql from 'graphql-tag';

const ALL_PRODUCTS = gql`
  query {
    productDetailPageCollection(limit: 20) {
      items {
        shopifyProductHandle
        productName
        urlSlug
      }
    }
  }
`;

export default ALL_PRODUCTS;
