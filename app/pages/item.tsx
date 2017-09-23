import * as React from 'react';

import { Layout } from '../components/Layout';
import { registerSW } from '../helpers/sw';
import { ItemHeaderComponent } from '../components/ItemHeader';
import { Item } from '../server/types';
import { ItemProps } from '../components/types';
import { CommentThreadComponent } from '../components/Comments';

export default class ItemPage extends React.Component<ItemProps> {
  render() {
    return (
      <Layout title={this.getPageTitle(this.props.item)}>
        <div className="item-page">
          <ItemHeaderComponent item={this.props.item} />
          <CommentThreadComponent item={this.props.item} />
        </div>
      </Layout>
    );
  }

  private getPageTitle(item: Item): string {
    if (item.title) return item.title;
    return (this.props.item.text || '').substr(0, 70) + '...';
  }

  static async getInitialProps(context: Context): Promise<ItemProps> {
    if (context.req) {
      return context.query;
    }

    const response = await fetch(`/_api/item/${context.query.item.id}`);
    const item = await response.json();

    return {
      item
    };
  }
}

type Context = {
  req: any;
  pathname: string;
  query: ItemProps;
};
