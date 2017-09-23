import * as React from 'react';
import { ItemProps } from './types';
import { ItemTitleComponent } from './ItemTitle';

export const ItemHeaderComponent = ({ item }: ItemProps) => (
  <div>
    <ItemTitleComponent item={item} />
    {item.text ? <div className="item-title-text" dangerouslySetInnerHTML={{ __html: item.text }}></div> : ''}
    <hr style={{ marginTop: '1em' }} />
  </div>
);
