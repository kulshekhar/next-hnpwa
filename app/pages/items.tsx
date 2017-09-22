import * as React from 'react';

import { Layout } from '../components/Layout';
import { Item } from '../server/types';
import { getPageTitle } from '../server/helpers';
import { registerSW } from '../helpers/sw';

export class Items extends React.Component<ItemsProps> {
  render() {
    return (
      <Layout title={this.props.pageTitle}>
        {this.props.items.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </Layout>
    );
  }

  componentDidMount() {
    registerSW();
  }

  static async getInitialProps(context: Context): Promise<ItemsProps> {
    if (context.req) {
      return {
        pageTitle: context.query.pageTitle,
        items: context.query.items
      };
    }

    const pathname = context.pathname === '/' ? '/top' : context.pathname;
    const page = context.query && context.query.page ? context.query.page : 1;

    const response = await fetch(`/_api${pathname}/${page}`);
    const items = await response.json();

    return {
      pageTitle: getPageTitle(pathname),
      items
    };
  }
}

type ItemsProps = {
  pageTitle: string;
  items: Item[];
}

type Context = {
  req: any;
  pathname: string;
  query: {
    page: number;
    pageTitle: string;
    items: Item[];
  };
}
