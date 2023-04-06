import axios from 'axios';
import {
  GET_TEXT_IMAGE_SECTION,
  PRODUCT_BRAGBAR_SECTION,
  PRODUCT_DETAIL,
  PRODUCT_EMAIL_SIGNUP,
  PRODUCT_FAQ_SECTION,
  PRODUCT_INFLUENCE_REVIEW,
  PRODUCT_REASON_TO_LOVE,
  PRODUCT_REVIEW_SECTION,
  PRODUCT_TEXT_OVER_IMAGE,
  PRODUCT_YOU_MAY_ALSO_LIKE,
} from '@graphql/queries/product-page-sections';

import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export const getPDPLayoutData = async (
  apolloClient: any,
  shopifyClient: any,
  brand: string,
  urlSlug: string
) => {
  const pageSections: any[] = [];

  try {
    const axiosInstance = axios.create({
      baseURL: `https://cdn.contentful.com/spaces/${serverRuntimeConfig[brand]?.CONTENTFUL_SPACE_ID}/environments/${serverRuntimeConfig[brand]?.CONTENTFUL_ENVIRONMENT_ID}`,
      timeout: 10000,
    });

    const response: { data: any } = await axiosInstance.get(
      `/entries?access_token=${serverRuntimeConfig[brand]?.CONTENTFUL_ACCESS_TOKEN}&content_type=productDetailPageLayout&fields.urlSlug[match]=${urlSlug}`
    );

    if (!response?.data?.items?.length) {
      //Try to fetch product by handle
      const product = await shopifyClient.product.fetchByHandle(urlSlug);
      pageSections.push({
        __typename: 'Product',
        // productContentData: product,
        productShopifyData: JSON.parse(JSON.stringify(product)),
      });
      return pageSections;
    }
    const {
      data: { includes, items },
    } = response;
    const sectionsMeta: any[] = items[0]?.fields?.sections;
    for (let i = 0; i < sectionsMeta?.length; i++) {
      const section = includes.Entry.filter(
        (ent) => ent.sys.id === sectionsMeta[i].sys.id
      )[0];
      const sectionContentType = section?.sys.contentType.sys.id;
      if (!sectionContentType) continue;
      let query = null;

      switch (sectionContentType) {
        case 'product': {
          query = PRODUCT_DETAIL;
          break;
        }
        case 'reviewSection': {
          query = PRODUCT_REVIEW_SECTION;
          break;
        }
        case 'influencerReview': {
          query = PRODUCT_INFLUENCE_REVIEW;
          break;
        }
        case 'textOverImageSection': {
          query = PRODUCT_TEXT_OVER_IMAGE;
          break;
        }
        case 'emailSignupSection': {
          query = PRODUCT_EMAIL_SIGNUP;
          break;
        }
        case 'carouselSection': {
          query = PRODUCT_REASON_TO_LOVE;
          break;
        }
        case 'faqSection': {
          query = PRODUCT_FAQ_SECTION;
          break;
        }
        case 'bragBar': {
          query = PRODUCT_BRAGBAR_SECTION;
          break;
        }
        case 'textImageSection': {
          query = GET_TEXT_IMAGE_SECTION;
          break;
        }
        case 'youMayAlsoLikeSection': {
          query = PRODUCT_YOU_MAY_ALSO_LIKE;
          break;
        }
        default:
          break;
      }
      if (query) {
        try {
          const response = await apolloClient.query({
            query,
            variables: {
              id: sectionsMeta[i].sys.id,
            },
          });
          let sectionData = response?.data[sectionContentType];
          if (sectionContentType === 'product' && sectionData) {
            const product = JSON.parse(JSON.stringify(sectionData));
            try {
              // Get Shopify data for product & upsell
              let upsellShopifyData = null;
              if (product?.upsellCollection?.items?.length) {
                const upsellShopifyHandle =
                  product?.upsellCollection?.items[0].shopifyHandle;
                upsellShopifyData = await shopifyClient.product.fetchByHandle(
                  upsellShopifyHandle
                );
              }
              const productShopifyData =
                product?.shopifyProduct &&
                (await shopifyClient.product.fetch(product.shopifyProduct));
              sectionData = {
                __typename: product.__typename,
                productContentData: product,
                productShopifyData: JSON.parse(
                  JSON.stringify(productShopifyData)
                ),
                upsellShopifyData: upsellShopifyData
                  ? JSON.parse(JSON.stringify(upsellShopifyData))
                  : null,
              };
            } catch (error) {
              console.error('Err in fetching shopify data', error);
            }
          }
          if (
            sectionContentType === 'youMayAlsoLikeSection' &&
            sectionData?.recommendedProductsCollection?.items?.length
          ) {
            const products = sectionData?.recommendedProductsCollection?.items;
            const productsWithShopify = [];
            for (let i = 0; i < products.length; i++) {
              const shopifyData = await shopifyClient.product.fetchByHandle(
                products[i].shopifyHandle
              );
              productsWithShopify.push({
                ...sectionData.recommendedProductsCollection.items[i],
                shopifyData: JSON.parse(JSON.stringify(shopifyData)),
              });
            }
            sectionData = {
              ...sectionData,
              recommendedProductsCollection: {
                items: [...productsWithShopify],
              },
            };
          }
          pageSections.push(sectionData);
        } catch (error) {
          console.error(`error in fetching ${sectionContentType}`, error);
        }
      }
    }
    return pageSections;
  } catch (error) {
    console.error('Err in fetching PDP Layout data', error);
  }
  return null;
};
