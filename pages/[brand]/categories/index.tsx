import * as React from 'react';
import 'twin.macro';

import FeaturedCollections from '@components/categories/FeaturedCollections';
import CollectionSwiper from '@components/categories/CollectionSwiper';
import EmailLeadForm from '@components/product/EmailLeadForm';
import {
  getAllCategories,
  getShopifyCollectionData,
} from '@services/getCategoriesData';
import { getApolloClient } from '@graphql/apollo-client';
import { EMAIL_SIGNUP } from '@graphql/queries/product-page-sections/product-email-signup';

interface ICategoriesPage {
  categories: any;
  ctaContentful: any;
}

const CategoriesPage: React.FC<ICategoriesPage> = ({
  categories,
  ctaContentful,
}) => {
  const [featuredData, setFeaturedData] = React.useState([]);
  const [collectionData, setCollectionData] = React.useState([]);

  React.useEffect(() => {
    if (categories && categories.items?.length) {
      const featList = [],
        collectionList = [];
      for (let i = 0; i < categories.items?.length; i++) {
        if (categories.items[i]?.slug?.includes('featured')) {
          featList.push(categories.items[i]);
        } else {
          collectionList.push(categories.items[i]);
        }
      }
      setFeaturedData(featList);
      setCollectionData(collectionList);
    }
  }, [categories]);

  if (!categories) return null;

  return (
    <div tw="flex flex-col relative md:py-4">
      <div tw="flex flex-col">
        {featuredData.length && <FeaturedCollections data={featuredData[0]} />}

        <div tw="md:(pl-20 pt-17.5) ">
          {collectionData?.map((category, index) => (
            <div key={index} tw="mt-1 md:mt-0">
              <CollectionSwiper
                data={category}
                title={category.categoryTitle}
              />
            </div>
          ))}
        </div>
      </div>

      <div tw="mt-12 md:mt-0">
        <EmailLeadForm data={ctaContentful} />
      </div>
    </div>
  );
};

export default CategoriesPage;

export const getServerSideProps = async ({ query }) => {
  try {
    const apolloClient = getApolloClient(query.brand);
    const categoriesContefulData = await getAllCategories(query.brand);
    const categories = await getShopifyCollectionData(
      categoriesContefulData,
      query.brand
    );

    const ctaContentful = await apolloClient.query({
      query: EMAIL_SIGNUP,
    });

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)),
        ctaContentful:
          ctaContentful?.data?.emailSignupSectionCollection?.items[0],
      },
    };
  } catch (error) {
    console.error('Error in fetching Categories data');
  }

  return {
    props: {
      categores: null,
    },
  };
};
