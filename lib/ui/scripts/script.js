import path from 'path';
import webpack from 'webpack';

import config from './config';

const resolveLocal = dir => path.join(__dirname, dir);
const webpackAsPromised = c =>
  new Promise((res, rej) => {
    webpack(c).run((err, stats) => {
      if (err || stats.hasErrors() || stats.hasWarnings()) {
        rej(stats);
      }
      res(stats);
    });
  });

const run = async () => {
  // const out = await webpackAsPromised(
  //   config({
  //     entry: {
  //       react: ['react', 'react-dom'],
  //     },
  //     provided: [],
  //   })
  // );
  const out2 = await webpackAsPromised(
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
      // provided: ['react', 'react-dom'],
    })
  );
  return out2;
};

// storybook_ui: [resolveLocal('../dist/index.js')],

run().then(
  s => {
    console.log('success: ', s.toString());
    process.exitCode = 0;
  },
  s => {
    console.error('failed: ', s.toString());
    process.exitCode = 1;
  }
);
