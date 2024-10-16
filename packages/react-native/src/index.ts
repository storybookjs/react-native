import type { CoreConfig, StorybookConfig as StorybookConfigBase } from '@storybook/core/types';
import type { ReactNativeOptions } from './Start';
export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';

export { start, prepareStories, getProjectAnnotations, updateView } from './Start';

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  addons: string[];
  reactNative?: ReactNativeOptions;
  core?: CoreConfig;
}
