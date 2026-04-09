import type { StorybookConfig as StorybookConfigBase } from 'storybook/internal/types';
import type { ReactNativeOptions } from './Start';

export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';
export { start, prepareStories, getProjectAnnotations, updateView } from './Start';
export type { View, Storage, InitialSelection, ThemePartial, Params } from './View';
export {
  RN_STORYBOOK_EVENTS,
  RN_STORYBOOK_STORAGE_KEY,
  STORYBOOK_STORY_ID_PARAM,
} from './constants';

export interface Features {
  /** Enable the built-in on-device backgrounds addon panel. */
  ondeviceBackgrounds?: boolean;
}

type Addon = string | { name: string; options?: Record<string, any> };

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  addons?: Addon[];
  /**
   * On-device addons that should only be loaded at runtime on the device.
   * These are not evaluated as presets by Storybook Core, avoiding issues
   * with server-side operations like extract.
   *
   * Addons listed in `addons` with "ondevice" in their name still work
   * for backwards compatibility.
   */
  deviceAddons?: Addon[];
  // TODO move this to params
  reactNative?: ReactNativeOptions;
  features?: Features;
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
