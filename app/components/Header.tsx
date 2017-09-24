import * as React from 'react';

import { Nav } from './Nav';

export const Header = ({ page }: { page: string }) => (
  <header>
    <Nav page={page}></Nav>
  </header>
);
