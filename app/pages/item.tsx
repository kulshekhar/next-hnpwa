import * as React from 'react';

import { Layout } from '../components/Layout';
import { registerSW } from '../helpers/sw';
import { Item as ItemType } from '../server/types';

export default class Item extends React.Component<ItemProps> {
  render() {
    return (
      <Layout title={this.getPageTitle(this.props.item)}>
        <div className="item-page">
          <ItemHeader item={this.props.item} />
        </div>
      </Layout>
    );
  }

  private getPageTitle(item: ItemType): string {
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

const ItemHeader = ({ item }: ItemProps) => (
  <div>
    <ItemTitle item={item} />
    {item.text ? <div className="item-title-text" dangerouslySetInnerHTML={{ __html: item.text }}></div> : ''}
    <hr style={{ marginTop: '1em' }} />
    <CommentThread item={item} />
  </div>
);

const CommentThread = ({ item }: ItemProps) => (
  <div className="comment-container">
    {item.subItems.map(subitem => (
      <Comment key={subitem.id} item={subitem} />
    ))}
  </div>
);

const Comment = ({ item }: ItemProps) => (
  <div className={`cc-${item.level - 1}`}>
    {item.by ? (
      <div className="comment-meta">
        <span style={{ paddingRight: 8 }}>➡</span>
        <a href={`/user/${item.by}`}>{item.by}</a>
        <a href={`/item/${item.id}`}> {item.moment}</a>
      </div>
    ) : ''}
    <div className="comment" dangerouslySetInnerHTML={{ __html: item.text }}>
    </div>
    {
      item.level > 3 && item.kids
        ? <a href={`/item/${item.id}`} className="continue-thread">Continue reading this thread</a>
        : item.subItems.map(subitem => (
          <Comment item={subitem} />
        ))
    }

  </div>
);

const ItemTitle = ({ item }: ItemProps) => (
  <div>
    {item.title ? (
      <div>
        <a href={`/item/${item.id}`} className="item-title">{item.title}</a>
        {item.domain ? (<span className="list-item-domain"><a href={item.url}>({item.domain})</a></span>) : ''}
      </div>
    ) : ''}

    <div className="list-item-meta" style={{ marginLeft: 0 }}>
      {item.score ? <span>{item.score} point{item.score == 1 ? ' by' : 's by'}</span> : ''}
      <span> <a href={`/user/${item.by}`}>{item.by}</a> </span>
      <span> <a href={`/item/${item.id}`}>{item.moment}</a> </span>
      {
        item.parent

          ? <span> | <a href={`/item/${item.parent}`}>parent</a></span>

          : <span> | <a href={`/item/${item.id}`}>{item.descendants > 0 ? item.descendants.toString() + ' comment' + (item.descendants === 1 ? '' : 's') : 'discuss'}</a></span>
      }
    </div>
  </div>
);

type ItemProps = {
  item: ItemType;
};

type Context = {
  req: any;
  pathname: string;
  query: ItemProps;
};
