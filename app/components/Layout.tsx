import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { Header } from './Header';

export const Layout = (props: LayoutProps) => (
  <div className="layout">
    <Head>
      <title>{props.title}</title>
    </Head>

    <Header></Header>

    <main>
      {props.children}
    </main>
  </div>
);

type LayoutProps = {
  title: string;
  children: any;
}
