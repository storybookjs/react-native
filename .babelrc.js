module.exports = {
  presets: [
    ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage' }],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'babel-plugin-macros',
    ['emotion', { sourceMap: true, autoLabel: true }],
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage' }]],
      plugins: ['babel-plugin-require-context-hook', 'babel-plugin-dynamic-import-node'],
    },
  },
  overrides: [
    {
      test: './examples/vue-kitchen-sink',
      presets: ['babel-preset-vue'],
    },
    {
      test: './lib',
      presets: [
        ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage' }],
        '@babel/preset-react',
      ],
      plugins: [
        ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        'babel-plugin-macros',
        ['emotion', { sourceMap: true, autoLabel: true }],
        '@babel/plugin-transform-react-constant-elements',
        'babel-plugin-add-react-displayname',
      ],
    },
    {
      test: [
        './lib/core/src/server',
        './lib/node-logger',
        './lib/codemod',
        './addons/storyshots',
        './addons/storysource/src/loader',
        './app/**/src/server/**',
        './app/**/src/bin/**',
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            targets: {
              node: '8.11',
            },
          },
        ],
      ],
    },
  ],
};
