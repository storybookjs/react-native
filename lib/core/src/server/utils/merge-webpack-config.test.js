import mergeConfigs from './merge-webpack-config';

const config = {
  devtool: 'source-maps',
  entry: {
    bundle: 'index.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: ['r1', 'r2'],
  },
  plugins: ['p1', 'p2'],
  resolve: {
    enforceModuleExtension: true,
    extensions: ['.js', '.json'],
    alias: {
      A1: 'src/B1',
      A2: 'src/B2',
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },
};

describe('mergeConfigs', () => {
  it('merges two full configs in one', () => {
    const customConfig = {
      profile: true,
      entry: {
        bundle: 'should_not_be_merged.js',
      },
      output: {
        filename: 'should_not_be_merged.js',
      },
      module: {
        noParse: /jquery|lodash/,
        rules: ['r3', 'r4'],
      },
      plugins: ['p3', 'p4'],
      resolve: {
        enforceExtension: false,
        extensions: ['.ts', '.tsx'],
        alias: {
          A3: 'src/B3',
          A4: 'src/B4',
        },
      },
      optimization: {
        minimizer: ['banana'],
      },
    };

    const result = mergeConfigs(config, customConfig);

    expect(result).toMatchSnapshot();
  });

  it('merges partial custom config', () => {
    const customConfig = {
      plugins: ['p3'],
      resolve: {
        extensions: ['.ts', '.tsx'],
      },
    };

    const result = mergeConfigs(config, customConfig);

    expect(result).toMatchSnapshot();
  });

  it('merges successfully if custom config is empty', () => {
    const customConfig = {};

    const result = mergeConfigs(config, customConfig);

    expect(result).toMatchSnapshot();
  });
});
