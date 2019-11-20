module.exports = {
  presets: ['@storybook/addon-docs/preset'],
  stories: [
    '../../lib/ui/src/**/*.stories.(js|tsx|mdx)',
    '../../lib/components/src/**/*.stories.(js|tsx|mdx)',
    './stories/**/*.stories.(js|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-storysource/register',
    '@storybook/addon-design-assets/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-events/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-options/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-cssresources/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-jest/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-graphql/register',
    '@storybook/addon-contexts/register',
  ],
  webpack: async (config, { configType }) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules.slice(1),
        {
          test: /\.(mjs|jsx?|tsx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: `.cache/storybook`,
                presets: [
                  [
                    '@babel/preset-env',
                    { shippedProposals: true, useBuiltIns: 'usage', corejs: 3 },
                  ],
                  '@babel/preset-typescript',
                  configType === 'PRODUCTION' && [
                    'babel-preset-minify',
                    { builtIns: false, mangle: false },
                  ],
                  '@babel/preset-react',
                  '@babel/preset-flow',
                ].filter(Boolean),
                plugins: [
                  '@babel/plugin-proposal-object-rest-spread',
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import',
                  ['babel-plugin-emotion', { sourceMap: true, autoLabel: true }],
                  'babel-plugin-macros',
                  '@babel/plugin-transform-react-constant-elements',
                  'babel-plugin-add-react-displayname',
                  [
                    'babel-plugin-react-docgen',
                    { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' },
                  ],
                ],
              },
            },
          ],
          exclude: [/node_modules/, /dist/],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
    },
  }),
};
