import type { StorybookConfig as StorybookConfigBase } from 'storybook/internal/types';
import type { ReactNativeOptions } from './Start';
export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';

export { start, prepareStories, getProjectAnnotations, updateView } from './Start';
export type { View, Storage, InitialSelection, ThemePartial, Params } from './View';

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  addons: Array<string | { name: string; options?: Record<string, any> }>;
  // TODO move this to params
  reactNative?: ReactNativeOptions;
  framework?: '@storybook/react-native';
}

export type {
  Meta,
  StoryFn,
  StoryObj,
  Args,
  ArgTypes,
  Preview,
  Decorator,
  Loader,
  Parameters,
} from '@storybook/react';
