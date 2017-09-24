import * as React from 'react';
import Head from 'next/head';

import { Header } from './Header';
import { ServiceWorker } from './ServiceWorker';

export const Layout = (props: LayoutProps = {}) => (
  <div className="layout">
    <Head>
      <title>{props.title}</title>
    </Head>

    <Header page={props.page}></Header>

    <main>
      {props.children}
    </main>

    <ServiceWorker />
  </div>
);

type LayoutProps = {
  page?: string;
  title?: string;
  children?: any;
}
