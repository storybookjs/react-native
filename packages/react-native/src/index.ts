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
  /**
   * @deprecated Use `deviceAddons` for every addon that should be bundled with
   * the on-device preview (including `@storybook/addon-ondevice-*`, other
   * RN-side addons, and local paths). This field will be removed in a future
   * major version. A separate web or Node Storybook `main` file (for example
   * for `@storybook/react-native-web-vite`) follows that package’s own API;
   * this deprecation applies to `.rnstorybook` config typed as
   * `StorybookConfig` from `@storybook/react-native`.
   */
  addons?: Addon[];
  /**
   * Addons loaded only at runtime on the device and merged into
   * `storybook.requires`. Not evaluated as presets by Storybook Core, which
   * avoids failures during server-side operations like `extract`.
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
