module.exports = {
  presets: ['@storybook/addon-docs/preset'],
  stories: ['../src/stories/**/*.stories.(ts|mdx)'],
  addons: [
    '@storybook/addon-storysource/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-options/register',
    '@storybook/addon-jest/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-a11y/register',
  ],
};
