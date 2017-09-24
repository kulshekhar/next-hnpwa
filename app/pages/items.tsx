import * as React from 'react';
import Link from 'next/link';

import { Layout } from '../components/Layout';
import { getPageDetails } from '../server/helpers';
import { Item, ListWrapper } from '../server/types';
import { PaginationComponent } from '../components/Pagination';
import { ItemProps } from '../components/types';

export class Items extends React.Component<ItemsProps> {
  render() {
    return (
      <Layout title={this.props.pageTitle} page={this.props.pageName}>
        <ol className="item-list">
          {this.props.items.map(item => (
            <ListItem key={item.id} item={item} />
          ))}
        </ol>
        <PaginationComponent pageName={this.props.pageName} pageNo={this.props.pageNo} pageCount={this.props.pageCount} />
      </Layout>
    );
  }

  static async getInitialProps(context: Context): Promise<ItemsProps> {
    if (context.req) {
      console.log('>>>', context.req.query);

      return {
        pageTitle: context.query.pageTitle,
        items: context.query.items,
        pageName: context.query.pageName,
        nextPageNo: context.query.nextPageNo,
        pageNo: context.query.pageNo,
        pageCount: context.query.pageCount,
      };
    }

    const pathname = context.pathname === '/' ? '/top' : context.pathname;

    const pageNo = context.query && context.query.pageNo
      ? typeof context.query.pageNo == 'string' ? parseInt(context.query.pageNo) : context.query.pageNo
      : 1;

    const response = await fetch(`/_api${pathname}/${pageNo}`);
    const wrapper: ListWrapper = await response.json();

    const pageDetails = getPageDetails(pathname);

    return {
      pageTitle: pageDetails.title,
      pageName: pageDetails.page,
      nextPageNo: pageNo + 1,
      pageNo: pageNo,
      items: wrapper.items,
      pageCount: wrapper.pageCount,
    };
  }
}

const ListItem = ({ item }: ItemProps) => (
  <li className="list-item-row">
    <div className="list-item-index">{item.index}. </div>
    <div className="list-item-spacer"></div>
    <div>
      <div>
        <Link as={`/item/${item.id}`} href={`/item?id=${item.id}`}><a className="list-item-title">{item.title}</a></Link>

        {item.domain ? (<span className="list-item-domain"><a href={item.url}>({item.domain})</a></span>) : ''}
      </div>
      <div className="list-item-meta">
        <span>{item.score} point{item.score == 1 ? '' : 's'}</span>

        <Link as={`/user/${item.by}`} href={`/user?id=${item.by}`}><a> by {item.by}</a></Link>

        <Link as={`/item/${item.id}`} href={`/item?id=${item.id}`}><a> {item.moment}</a></Link>

        <Link as={`/item/${item.id}`} href={`/item?id=${item.id}`}><a> | {item.descendants > 0 ? item.descendants.toString() + ' comment' + (item.descendants === 1 ? '' : 's') : 'discuss'}</a></Link>

      </div>
    </div>
  </li>
);

type ItemsProps = {
  pageTitle: string;
  pageName: string;
  nextPageNo: number;
  pageNo?: number;
  items: Item[];
  pageCount: number;
};

type Context = {
  req: any;
  pathname: string;
  query: ItemsProps;
};
