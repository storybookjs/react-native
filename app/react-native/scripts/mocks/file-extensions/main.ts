import type { StorybookConfig } from '@storybook/core-common';

const config: StorybookConfig = {
  stories: ['./FakeStory.stories.tsx'],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

export default config;
