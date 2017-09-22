import * as React from 'react';

import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage()
    const styles = flush()
    return { html, head, errorHtml, chunks, styles }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet='utf-8' />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <meta name="theme-color" content="#ff6600" />
          <link rel="icon" href="/static/icons/i-64.png" />
          <link rel="manifest" href="/manifest.json" />
          <style>
            {`
              body {
                margin: 0;
                font-family: Verdana, Geneva, sans-serif;
              }

              .layout {
                background-color: whitesmoke;
              }

              Header {
                background-color: #ff6600;
                padding: 0.3em 1.5em;
              }

              Header a {
                color: #000;
                text-decoration: none;
                font-size: 14px;
              }

              @media (min-width: 751px) {
                .layout {
                  width: 750px;
                  margin: 0 auto;
                }
              }

              ol.item-list {
                list-style-type: none;
              }

              ol.item-list li {
                margin-left: -1em;
                color: #777;
                font-size: 14px;
              }

              .list-item-index {
                float: left;
                padding-right: 5px;
                height: 2em;
              }

              .list-item-title {
                color: #222;
              }

              .list-item-domain, .list-item-meta {
                margin-left: 0.5em;
                font-size: 12px;
              }

              .list-item-meta a, .list-item-domain a {
                color: #777;
                text-decoration: none;
              }

              .list-item-meta a:hover, .list-item-domain a:hover {
                text-decoration: underline;
              }

              .list-item-meta {
                margin: 5px 0 5px 1.5em;
              }

              a.list-item-title {
                text-decoration: none;
              }

              a.prev, a.next {
                color: #222;
                text-decoration: none;
                margin-bottom: 1em;
              }

              a.prev {
                float: left;
                margin-left: 1.5em;
              }

              a.next {
                float: right;
                margin-right: 1.5em;
              }

              .profile {
                padding: 1.5em;
                color: #777;
                font-size: 14px;
              }
            `}
          </style>
        </Head>
        <body className="body">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
