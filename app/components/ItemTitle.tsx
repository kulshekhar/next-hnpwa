import * as React from 'react';
import Link from 'next/link';

import { ItemProps } from './types';

export const ItemTitleComponent = ({ item }: ItemProps) => (
  <div>
    {
      item.title
        ? (
          item.url
            ? <a href={item.url} className="item-title">{item.title}</a>
            :
            <div>
              <Link as={`/item/${item.id}`} href={`/item?id=${item.id}`}><a className="item-title">{item.title}</a></Link>
              {item.domain ? (<span className="list-item-domain"><a href={item.url}>({item.domain})</a></span>) : ''}
            </div>
        )
        : ''
    }

    <div className="list-item-meta" style={{ marginLeft: 0 }}>
      {item.score ? <span>{item.score} point{item.score == 1 ? ' by' : 's by'}</span> : ''}

      <Link as={`/user/${item.by}`} href={`/user?id=${item.by}`}><a>{item.by}</a></Link>

      <Link as={`/item/${item.id}`} href={`item?id=${item.id}`}><a> {item.moment}</a></Link>

      {
        item.parent

          ? <Link as={`/item/${item.parent}`} href={`item?id=${item.parent}`}><a> | {item.moment}</a></Link>

          : <Link as={`/item/${item.id}`} href={`item?id=${item.id}`}><a> |{item.descendants > 0 ? item.descendants.toString() + ' comment' + (item.descendants === 1 ? '' : 's') : 'discuss'}</a></Link>
      }
    </div>
  </div>
);
