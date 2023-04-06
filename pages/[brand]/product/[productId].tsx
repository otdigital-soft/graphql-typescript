import * as React from 'react';
import 'twin.macro';

import Head from 'next/head';

import ProductLayout from '@components/product/ProductLayout';
import { IProduct } from 'context/types';
import { ProductProvider } from 'context/ProductProvider';
import { getPDPLayoutData } from '@services/getPDPLayoutData';
import { setCapitalForWords } from '@utils/general';
import { useRouter } from 'next/router';
import { getShopifyClient } from '@services/Shopifyclient';
import getConfig from 'next/config';
import { getApolloClient } from '@graphql/apollo-client';
import { IN_CART_UPSELL } from '@graphql/queries/in-cart-upsell';
import { useCart } from 'context/CartProvider';

const { publicRuntimeConfig } = getConfig();

const ProductPage: React.FC<IProduct> = (productData) => {
  const { query } = useRouter();

  const { onSetAlsoLikeProducts } = useCart();

  React.useEffect(() => {
    if (productData?.inCartUpsell?.length) {
      onSetAlsoLikeProducts(productData.inCartUpsell);
    }
  }, [productData?.inCartUpsell]);

  if (!productData?.productContentData) return null;

  return (
    <ProductProvider>
      <Head>
        <title>
          {setCapitalForWords(query.brand as string) +
            ' | ' +
            productData?.productContentData[0]?.productShopifyData?.title}
        </title>
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
      </Head>
      <ProductLayout sections={productData.productContentData} />
    </ProductProvider>
  );
};

export const getStaticProps = async ({
  params,
}): Promise<{ props: IProduct }> => {
  try {
    const apolloClient = getApolloClient(params.brand);
    const shopifyClient = getShopifyClient(params.brand);

    if (!apolloClient || !shopifyClient)
      throw new Error('Apollo || Shopify client is not created!');

    const sectionsData = await getPDPLayoutData(
      apolloClient,
      shopifyClient,
      params.brand,
      params.productId
    );

    const inCartUpsellProducts = [];
    try {
      const response = await apolloClient.query({
        query: IN_CART_UPSELL,
      });

      const products =
        response?.data?.inCartUpsellCollection?.items[0]
          ?.upsellProductsCollection?.items ?? null;
      if (products?.length) {
        for (let i = 0; i < products.length; i++) {
          const shopifyData = await shopifyClient.product.fetch(
            products[i].shopifyProduct
          );
          inCartUpsellProducts.push({
            ...products[i],
            shopifyData: JSON.parse(JSON.stringify(shopifyData)),
          });
        }
      }
    } catch (error) {
      console.error('error in getting inCartUpsell data');
    }

    return {
      props: {
        inCartUpsell: inCartUpsellProducts,
        productContentData: sectionsData,
      },
    };
  } catch (error) {
    console.error('Error happened in fetching PDP data', error);
  }

  return {
    props: {
      productContentData: null,
      inCartUpsell: null,
    },
  };
};

export default ProductPage;

export async function getStaticPaths() {
  const brands = Object.keys(publicRuntimeConfig);
  const paths = [];
  for (let i = 0; i < brands.length; i++) {
    const shopifyClient = getShopifyClient(brands[i]);
    const products = await shopifyClient.product.fetchAll(5);
    for (let j = 0; j < products.length; j++) {
      paths.push({
        params: { brand: brands[i], productId: products[j].handle },
      });
    }
  }

  return {
    fallback: true,
    paths: paths,
  };
}
