import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export const getApolloClient = (brand: string) => {
  if (!serverRuntimeConfig[brand]) return null;

  const httpLink1 = createHttpLink({
    uri: `https://graphql.contentful.com/content/v1/spaces/${serverRuntimeConfig[brand]?.CONTENTFUL_SPACE_ID}/environments/${serverRuntimeConfig[brand]?.CONTENTFUL_ENVIRONMENT_ID}`,
  });

  const authLink1 = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${serverRuntimeConfig[brand]?.CONTENTFUL_GRAPHQL_BEARER_TOKEN}`,
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink1.concat(httpLink1),
  });
};
