module.exports = {
  stories: ['../src/**/*.stories.(ts|mdx)'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-notes/register',
  ],
  presets: ['@storybook/addon-docs/preset'],
};
