module.exports = {
  stories: ['../src/stories/**/*.stories.(js|mdx)'],
  presets: ['@storybook/addon-docs/preset'],
  addons: [
    '@storybook/addon-storysource/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-options/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-contexts/register',
    '@storybook/addon-docs/register',
  ],
};
