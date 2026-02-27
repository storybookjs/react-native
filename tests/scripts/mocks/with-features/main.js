export default {
  stories: ['./FakeStory.stories.tsx'],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
  features: {
    ondeviceBackgrounds: true,
  },
};
