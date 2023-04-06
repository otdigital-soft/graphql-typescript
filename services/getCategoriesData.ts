import { getApolloClient } from '../graphql';
import ALL_CATEGORIES from '@graphql/queries/all-categories';
import { getShopifyClient } from '@services/Shopifyclient';

export const getAllCategories = async (brand) => {
  const apolloClient = getApolloClient(brand);
  const response = await apolloClient.query({
    query: ALL_CATEGORIES,
  });

  return response?.data?.categoryCollection;
};

export const getShopifyCollectionData = async (categories, brand) => {
  const shopifyClient = getShopifyClient(brand);

  if (!categories) return null;
  const data = JSON.parse(JSON.stringify(categories));
  for (let i = 0; i < data?.items?.length; i++) {
    try {
      const {
        orderedCollectionsCollection: { items },
      } = data.items[i];
      for (let j = 0; j < items?.length; j++) {
        const { shopifyCollectionId } = items[j];
        if (!shopifyCollectionId) continue;
        const product = await shopifyClient.collection.fetchWithProducts(
          shopifyCollectionId
        );
        data.items[i].orderedCollectionsCollection.items[j].shopifyData =
          product;
      }
    } catch (error) {
      console.error('error in fetching shopify data', error);
    }
  }
  return data;
};
