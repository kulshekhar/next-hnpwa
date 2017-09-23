import * as React from 'react';
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
          <CommentComponent item={subitem} />
        ))
    }

  </div>
);
