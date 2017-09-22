import * as React from 'react';
import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

export const Nav = () => (
  <nav>
    <Link href='/'>
      <a style={linkStyle}>home</a>
    </Link>
    <Link prefetch href='/new'>
      <a style={linkStyle}>new</a>
    </Link>
    <Link prefetch href='/best'>
      <a style={linkStyle}>best</a>
    </Link>
    <Link prefetch href='/show'>
      <a style={linkStyle}>show</a>
    </Link>
    <Link prefetch href='/ask'>
      <a style={linkStyle}>ask</a>
    </Link>
    <Link prefetch href='/job'>
      <a style={linkStyle}>jobs</a>
    </Link>
  </nav>
);

