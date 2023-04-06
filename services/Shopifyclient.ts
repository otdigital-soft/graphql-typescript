import Client from 'shopify-buy';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const getShopifyClient = (brand: string) =>
  Client.buildClient({
    domain: `${publicRuntimeConfig[brand]?.credentials?.SHOPIFY_STORE_DOMAIN}`,
    storefrontAccessToken: `${publicRuntimeConfig[brand]?.credentials?.SHOPIFY_STORE_FRONT_ACCESS_TOKEN}`,
  });
