import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { Header } from './Header';
import { ServiceWorker } from './ServiceWorker';

export const Layout = (props: LayoutProps) => (
  <div className="layout">
    <Head>
      <title>{props.title}</title>
    </Head>

    <Header></Header>

    <main>
      {props.children}
    </main>

    <ServiceWorker />
  </div>
);

type LayoutProps = {
  title: string;
  children: any;
}
