import * as React from 'react';
import 'twin.macro';
import Head from 'next/head';
import { getApolloClient } from '@graphql/apollo-client';
import { SINGLE_COLLECTION } from '@graphql/queries/collection';

import { getShopifyClient } from '@services/Shopifyclient';
import CollectionLayout from '@components/collection';
import { EMAIL_SIGNUP } from '@graphql/queries/product-page-sections/product-email-signup';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface ICollectionPage {
  data: {
    collectionContentful: any;
    collectionShopify: any;
    ctaContentful: any;
    allProducts?: any;
  };
}

const CollectionPage: React.FC<ICollectionPage> = ({ data }) => {
  if (data?.allProducts)
    return (
      <CollectionLayout
        collectionData={{
          collectionContentful: null,
          collectionShopify: { products: data?.allProducts },
          ctaContentful: null,
        }}
      />
    );

  if (!data) return null;

  if (!data || !data.collectionContentful) return null;

  return (
    <>
      <Head>
        <title>Collection | {data?.collectionContentful?.name}</title>
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
      </Head>
      <CollectionLayout collectionData={data} />
    </>
  );
};

export const getStaticProps = async ({
  params,
}): Promise<{
  props: ICollectionPage;
}> => {
  try {
    const shopifyClient = getShopifyClient(params.brand);

    if (params.collectionId === 'all-products') {
      let products = [];
      try {
        products = await shopifyClient.product.fetchAll(24);

        if (products?.length) {
          // let hasNextPage = products[products.length - 1].hasNextPage;
          while (products[products.length - 1].hasNextPage) {
            const newProducts = await shopifyClient.fetchNextPage(products);
            products.push(...newProducts.model);
          }
        }
      } catch (error) {
        console.error('Error fetch all products: ', error);
      }

      return {
        props: {
          data: {
            allProducts: JSON.parse(JSON.stringify(products)),
            collectionContentful: null,
            collectionShopify: null,
            ctaContentful: null,
          },
        },
      };
    }

    const apolloClient = await getApolloClient(params.brand);

    if (!apolloClient) throw new Error('Apollo client is not created');

    const collections = await shopifyClient.collection.fetchAllWithProducts();

    const collection = collections.find(
      (item) => item.handle === params.collectionId
    );

    const collectionContentful = await apolloClient.query({
      query: SINGLE_COLLECTION,
      variables: { collectionId: collection.id },
    });

    const ctaContentful = await apolloClient.query({
      query: EMAIL_SIGNUP,
    });

    // const productShopify = await client.collection.fetchWithProducts(
    //   collectionContentful?.data?.collectionCollection?.items[0]
    //     ?.shopifyCollectionId
    // );

    // const productsData = await addProductContentData(productShopify);

    return {
      props: {
        data: {
          collectionContentful:
            collectionContentful?.data?.collectionCollection?.items[0] ?? null,
          collectionShopify: JSON.parse(JSON.stringify(collection)),
          ctaContentful:
            ctaContentful?.data?.emailSignupSectionCollection?.items[0],
        },
      },
    };
  } catch (error) {
    console.error('Error happened in fetching data', error);
  }

  return {
    props: { data: null },
  };
};

export default CollectionPage;

export async function getStaticPaths() {
  // const brands = Object.keys(publicRuntimeConfig);
  const paths = [];
  // for (let i = 0; i < brands.length; i++) {
  //   const shopifyClient = getShopifyClient(brands[i]);
  //   const collections = await shopifyClient.collection.fetchAllWithProducts();
  //   for (let j = 0; j < collections.length; j++) {
  //     paths.push({
  //       params: { brand: brands[i], collectionId: collections[j].handle },
  //     });
  //   }
  // }

  return {
    paths: paths,
    fallback: true,
  };
}
