import SINGLE_PRODUCT from '@graphql/queries/single-product';

// import { apolloClient } from '../graphql';
const apolloClient = null;

export const addProductContentData = async (shopifyData) => {
  if (!shopifyData) return null;
  const data = JSON.parse(JSON.stringify(shopifyData));
  for (let i = 0; i < data?.products?.length; i++) {
    try {
      const { handle, id } = data?.products[i];
      const response = await apolloClient.query({
        query: SINGLE_PRODUCT,
        variables: {
          productId: id,
        },
      });
      data.products[i].contentData = response.data?.productCollection?.items[0];
      // data.products[i].urlSlug =
      //   response.data?.productDetailPageCollection?.items[0]?.urlSlug;
    } catch (error) {
      console.error('error in fetching shopify data', error);
      return null;
    }
  }
  return data;
};
