import * as React from 'react';
import 'twin.macro';
import { getApolloClient } from '@graphql/apollo-client';
import { CategoryLayout } from '@components/category';
import SINGLE_CATEGORY from '@graphql/queries/single-category';
import { getShopifyCollectionData } from '@services/getCategoriesData';

const CategoryPage: React.FC<{ category: any }> = ({ category }) => {
  if (!category) return null;
  return <CategoryLayout data={category?.items[0]} />;
};

export const getServerSideProps = async ({
  query,
}): Promise<{ props: { category: any } }> => {
  try {
    const apolloClient = getApolloClient(query.brand);
    const categoryContentful = await apolloClient.query({
      query: SINGLE_CATEGORY,
      variables: { urlSlug: query.categoryId },
    });

    const category = await getShopifyCollectionData(
      categoryContentful?.data?.categoryCollection,
      query.brand
    );

    return {
      props: {
        category: JSON.parse(JSON.stringify(category)),
      },
    };
  } catch (error) {
    console.error('Error happened in fetching data', error);
  }

  return {
    props: {
      category: null,
    },
  };
};

export default CategoryPage;
