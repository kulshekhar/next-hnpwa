import * as React from 'react';
import Link from 'next/link';
import { ItemProps } from './types';

export const CommentThreadComponent = ({ item }: ItemProps) => (
  <div className="comment-container">
    {item.subItems.map(subitem => (
      <CommentComponent key={subitem.id} item={subitem} />
    ))}
  </div>
);

const CommentComponent = ({ item }: ItemProps) => (
  <div className={`cc-${item.level - 1}`}>
    {item.by ? (
      <div className="comment-meta">
        <span style={{ paddingRight: 8 }}>●</span>
        <Link as={`/user/${item.by}`} href={`/user?id=${item.by}`}><a>{item.by}</a></Link>
        <Link as={`/item/${item.id}`} href={`/item?id=${item.id}`}><a> {item.moment}</a></Link>
      </div>
    ) : ''}
    <div className="comment" dangerouslySetInnerHTML={{ __html: item.text }}>
    </div>
    {
      item.level > 3 && item.kids
        ? <Link as={`/item/${item.id}`} href={`/item?id=${item.id}`}><a className="continue-thread">Continue reading this thread</a></Link>
        : item.subItems.map(subitem => (
          <CommentComponent key={subitem.id} item={subitem} />
        ))
    }

  </div>
);
