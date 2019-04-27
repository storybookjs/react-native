import path from 'path';
import { NormalModuleReplacementPlugin, ProgressPlugin, DllPlugin } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const resolveLocal = dir => path.join(__dirname, dir);

const r = resolveLocal('../../../node_modules');
const out = resolveLocal('../../core/dll');

export default ({ entry, provided = [] }) => ({
  name: 'storybook-ui',
  mode: 'production',

  entry,
  output: {
    path: out,
    filename: '[name]_dll.js',
    library: '[name]_dll',
  },
  externals: provided,

  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../../../node_modules')],
  },

  plugins: [
    new ProgressPlugin(),
    new DllPlugin({
      context: r,
      path: `${out}/[name]-manifest.json`,
      name: '[name]_dll',
    }),
    new NormalModuleReplacementPlugin(/core-js/, resource => {
      // console.log(resource.request);
      try {
        require.resolve(resource.request);
      } catch (e) {
        const [, z] = resource.request.match(/core-js\/(.*)/);
        const p = z.replace('library/fn/', '');
        // console.log({ p });
        let f;
        if (!f) {
          try {
            // console.log(`core-js/modules/${p}`);
            f = require.resolve(`core-js/modules/${p}`);
          } catch (ee) {
            // console.log('no');
            //
          }
        }
        if (!f) {
          try {
            // console.log(`core-js/proposals/${p}`);
            f = require.resolve(`core-js/proposals/${p}`);
          } catch (ee) {
            // console.log('no');
            //
          }
        }
        if (!f) {
          try {
            // console.log(`core-js/features/${p}`);
            f = require.resolve(`core-js/features/${p}`);
          } catch (ee) {
            // console.log('no');
            //
          }
        }
        if (!f) {
          try {
            // console.log(`core-js/stage/${p}`);
            f = require.resolve(`core-js/stage/${p}`);
          } catch (ee) {
            // console.log('no');
            //
          }
        }
        if (!f) {
          try {
            // console.log(`core-js/web/${p}`);
            f = require.resolve(`core-js/web/${p}`);
          } catch (ee) {
            // console.log('no');
            //
          }
        }
        if (!f) {
          try {
            // console.log(`core-js/stable/${p}`);
            f = require.resolve(`core-js/stable/${p}`);
          } catch (ee) {
            // console.log('no');
            //
          }
        }
        if (!f) {
          // console.log('fatal');
          throw e;
        } else {
          // eslint-disable-next-line no-param-reassign
          resource.request = f;
        }
      }
    }),
  ],
  optimization: {
    concatenateModules: true,
    portableRecords: true,
    moduleIds: 'hashed',
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: file => file.replace('.js', '.LICENCE'),
          banner: licenseFile => `License information can be found in ${licenseFile}`,
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
});
