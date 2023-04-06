import { getApolloClient } from '../graphql/apollo-client';
import App from 'next/app';

import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';

import { Layout } from '../components/layout';
import GlobalStyles from '../styles/GlobalStyles';
import { NAVBAR } from '@graphql/queries/navbar-data';
import { FOOTER } from '@graphql/queries/footer-data';
import ALL_CATEGORIES from '@graphql/queries/all-categories';
import TagManager from 'react-gtm-module';
import { useRouter } from 'next/router';
import { ANNOUNCEMENT_BAR } from '@graphql/queries/announceBar';

const MyApp = ({ Component, layout, pageProps }): ReactElement => {
  const logoUrl = layout?.navbar?.menu?.logo.url;
  const { basePath, query } = useRouter();

  const tagManagerArgs = {
    gtmId: process.env.GTM_ID,
  };

  useEffect(() => {
    if (basePath === `/${process.env.COMPANY_BRAND}` && process.env.GTM_ID) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          href={`/${query.brand ?? 'favicon'}.png`}
        />
      </Head>
      <GlobalStyles />
      <Layout
        announcementBar={layout?.announcementBar}
        footer={layout?.footer}
        navbar={layout?.navbar}
      >
        <Component {...pageProps} logoUrl={logoUrl} />
      </Layout>
    </>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const apolloClient = await getApolloClient(
    appContext.router.query.brand ?? 'bullstrap'
  );

  try {
    if (!apolloClient) throw new Error('Apollo client is not created');

    const navbar = await apolloClient.query({
      query: NAVBAR,
    });

    const footer = await apolloClient.query({
      query: FOOTER,
    });

    let announcementBar = null;
    try {
      announcementBar = await apolloClient.query({
        query: ANNOUNCEMENT_BAR,
      });
    } catch (error) {
      console.error('error in announcementBar', error);
    }

    let collections = null;
    try {
      collections = await apolloClient.query({
        query: ALL_CATEGORIES,
      });
    } catch (error) {
      console.error('error to fetch collections data');
    }

    return {
      ...appProps,
      layout: {
        announcementBar:
          announcementBar?.data?.announcementBarCollection?.items[0],
        footer: footer?.data?.footerCollection?.items[0],
        navbar: {
          categories: collections?.data?.categoryCollection?.items,
          menu: navbar?.data?.navbarCollection?.items[0],
        },
      },
    };
  } catch (error) {
    console.error('error in fetching layout data');
  }

  return { ...appProps };
};

export default MyApp;
/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
