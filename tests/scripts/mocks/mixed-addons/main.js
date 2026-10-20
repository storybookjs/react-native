export default {
  stories: ['./FakeStory.stories.tsx'],
  addons: ['@storybook/addon-ondevice-notes'],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
