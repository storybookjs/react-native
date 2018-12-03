import path from 'path';
import webpack from 'webpack';

import config from './webpackDllsConfig';

const resolveLocal = dir => path.join(__dirname, dir);
const webpackAsPromised = c =>
  new Promise((res, rej) => {
    webpack(c).run((err, stats) => {
      if (err || stats.hasErrors() || stats.hasWarnings()) {
        rej(stats);
        return;
      }
      res(stats);
    });
  });

const run = () =>
  webpackAsPromised(
    config({
      entry: {
        storybook_ui: [
          'core-js/fn/array/iterator',
          'airbnb-js-shims',
          'core-js/es6/symbol',
          'react',
          'prop-types',
          'react-dom',
          '@storybook/components',
          '@storybook/addons',
          '@storybook/core-events',
          '@emotion/styled',
          '@emotion/provider',
          '@emotion/core',
          resolveLocal('../dist/index.js'),
        ],
      },
    })
  );

run().then(
  s => {
    // eslint-disable-next-line no-console
    console.log('success: ', s.toString());
    process.exitCode = 0;
  },
  s => {
    // eslint-disable-next-line no-console
    console.error('failed: ', s.toString());
    process.exitCode = 1;
  }
);
