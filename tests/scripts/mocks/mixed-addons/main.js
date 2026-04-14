export default {
  stories: ['./FakeStory.stories.tsx'],
  addons: ['__storybook_generate_test_nonexistent_addon__'],
  deviceAddons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
