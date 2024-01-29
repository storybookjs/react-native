import type { StorybookConfig as StorybookConfigBase } from '@storybook/types';
export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';

export { start } from './Start';

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  addons: string[];
}
