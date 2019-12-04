module.exports = {
  presets: [
    {
      name: '@storybook/addon-docs/preset',
      options: {
        configureJSX: true,
      },
    },
  ],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-events/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-options/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-jest/register',
  ],
  stories: ['../src/stories/**/*.stories.(js|mdx)'],
};
