/* eslint-disable @typescript-eslint/no-explicit-any */
import '@assets/main.css';
import 'nprogress/nprogress.css';

import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';

import ManagedUIContext from '@components/ui/context';
import Layout from '@components/ui/Layout';

import { initializeTagManager } from '@lib/tagmanager';
import useUser from '@lib/hooks/useUser';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user !== undefined) {
      initializeTagManager({ userId: user.username });
    }
  }, [user]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="/js/redirectIE.js" />
      </Head>
      <DefaultSeo
        defaultTitle="My NextJS App"
        description="template for nextjs-mongodb web application."
      />
      <ManagedUIContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  );
};

export default App;
