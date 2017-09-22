// import { Configuration } from 'webpack';

const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ANALYZE } = process.env

module.exports = {
  // distDir: process.env.FOR_FB ? '../fb/functions/next' : 'next',
  distDir: 'next',
  webpack: (/** @type{Configuration} */config, { dev }) => {
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }));
    }
    if (dev) {
      return config;
    }

    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        // minify: true,
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        runtimeCaching: [
          {
            handler: "networkFirst",
            urlPattern: /^https?.*/
          },
          {
            handler: "networkFirst",
            urlPattern: /\/_next\/.*/
          }
        ]
      })
    );

    config.resolve.alias = {
      'react': 'preact-compat/dist/preact-compat',
      'react-dom': 'preact-compat/dist/preact-compat'
    };

    return config
  }
}
