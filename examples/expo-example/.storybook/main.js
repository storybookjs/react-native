module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    {
      directory: '../other_components',
      files: '**/*.stories.?(ts|tsx|js|jsx)',
      titlePrefix: 'OtherComponents',
    },
  ],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-knobs',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
