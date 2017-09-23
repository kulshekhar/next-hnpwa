import * as React from 'react';

import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import { AppStyle } from '../components/AppStyle';

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
          <AppStyle />
        </Head>
        <body className="body">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
