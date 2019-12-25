const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.(mdx|[tj]sx?)'],
  addons: [
    {
      name: '@storybook/preset-create-react-app',
      options: {
        tsDocgenLoaderOptions: {
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
          shouldExtractLiteralValuesFromEnum: true,
          propFilter: prop => {
            // Currently not working, prop.parent is always null.
            if (prop.parent) {
              return !prop.parent.fileName.includes('node_modules/@types/react/');
            }

            return true;
          },
        },
      },
    },
    '@storybook/addon-docs/preset',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-a11y/register',
  ],
};
