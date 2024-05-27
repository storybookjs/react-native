import type { StorybookConfig as StorybookConfigBase } from '@storybook/types';
import type { ReactNativeOptions } from './Start';
export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';

export { start, prepareStories, getProjectAnnotations } from './Start';

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  addons: string[];
  reactNative?: ReactNativeOptions;
}
