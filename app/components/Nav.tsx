import * as React from 'react';
import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

export const Nav = ({ page }: { page: string }) => (
  <nav>
    <Link href='/'>
      <a style={linkStyle} className={page == 'top' ? 'menu-active' : ''}>home</a>
    </Link>
    <Link href='/new'>
      <a style={linkStyle} className={page == 'new' ? 'menu-active' : ''}>new</a>
    </Link>
    <Link href='/best'>
      <a style={linkStyle} className={page == 'best' ? 'menu-active' : ''}>best</a>
    </Link>
    <Link href='/show'>
      <a style={linkStyle} className={page == 'show' ? 'menu-active' : ''}>show</a>
    </Link>
    <Link href='/ask'>
      <a style={linkStyle} className={page == 'ask' ? 'menu-active' : ''}>ask</a>
    </Link>
    <Link href='/job'>
      <a style={linkStyle} className={page == 'job' ? 'menu-active' : ''}>jobs</a>
    </Link>
  </nav>
);

