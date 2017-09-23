import * as React from 'react';
import { ItemProps } from './types';

export const ItemTitleComponent = ({ item }: ItemProps) => (
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
