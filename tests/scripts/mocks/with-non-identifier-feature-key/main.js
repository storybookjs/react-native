export default {
  stories: ['./FakeStory.stories.tsx'],
  deviceAddons: ['@storybook/addon-ondevice-controls'],
  features: {
    'foo-bar': true,
    ondeviceBackgrounds: false,
  },
};
