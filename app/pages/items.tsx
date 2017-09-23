import * as React from 'react';

import { Layout } from '../components/Layout';
import { getPageDetails } from '../server/helpers';
import { Item } from '../server/types';
import { ItemProps } from '../components/types';

export class Items extends React.Component<ItemsProps> {
  render() {
    return (
      <Layout title={this.props.pageTitle}>
        <ol className="item-list">
          {this.props.items.map(item => (
            <ListItem key={item.id} item={item} />
          ))}
        </ol>
        <div className="pagination">
          {this.props.pageNo > 1
            ? (<a href={`/${this.props.pageName}/${this.props.pageNo - 1}`} className="prev">prev</a>)
            : ''}

          <a href={`/${this.props.pageName}/${this.props.nextPageNo}`} className="next">next</a>
        </div>
      </Layout>
    );
  }

  static async getInitialProps(context: Context): Promise<ItemsProps> {
    if (context.req) {
      return {
        pageTitle: context.query.pageTitle,
        items: context.query.items,
        pageName: context.query.pageName,
        nextPageNo: context.query.nextPageNo,
        pageNo: context.query.pageNo,
      };
    }

    const pathname = context.pathname === '/' ? '/top' : context.pathname;
    const page = context.query && context.query.pageNo ? context.query.pageNo : 1;

    const response = await fetch(`/_api${pathname}/${page}`);
    const items = await response.json();

    const pageDetails = getPageDetails(pathname);

    return {
      pageTitle: pageDetails.title,
      pageName: pageDetails.page,
      nextPageNo: page + 1,
      pageNo: page,
      items
    };
  }
}

const ListItem = ({ item }: ItemProps) => (
  <li>
    <div>
      <div className="list-item-index">{item.index}. </div>
      <a href={`/item/${item.id}`} className="list-item-title">{item.title}</a>
      {item.domain ? (<span className="list-item-domain"><a href={item.url}>({item.domain})</a></span>) : ''}
    </div>
    <div className="list-item-meta">
      <span>{item.score} point{item.score == 1 ? '' : 's'}</span>
      <span> by <a href={`/user/${item.by}`}>{item.by}</a> </span>
      <span> <a href={`/item/${item.id}`}>{item.moment}</a> </span>
      <span> | <a href={`/item/${item.id}`}>{item.descendants > 0 ? item.descendants.toString() + ' comment' + (item.descendants === 1 ? '' : 's') : 'discuss'}</a></span>
    </div>
  </li>
);

type ItemsProps = {
  pageTitle: string;
  pageName: string;
  nextPageNo: number;
  pageNo?: number;
  items: Item[];
};

type Context = {
  req: any;
  pathname: string;
  query: ItemsProps;
};
