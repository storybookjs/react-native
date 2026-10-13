import type { StorybookConfig as StorybookConfigBase } from 'storybook/internal/types';
import type { ReactNativeOptions } from '../Start';

export type Features = {
  /** Enable the built-in on-device backgrounds addon panel. */
  ondeviceBackgrounds?: boolean;
};

type Addon = string | { name: string; options?: Record<string, any> };

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  /**
   * Addons loaded only at runtime on the device and merged into
   * `storybook.requires`. Not evaluated as presets by Storybook Core, which
   * avoids failures during server-side operations like `extract`.
   */
  deviceAddons?: Addon[];
  /**
   * Sorts the stories, replacing `parameters.options.storySort` in preview. Each sorter only orders
   * the stories that the sorters before it consider equal. Comparator functions are copied into
   * `storybook.requires` from their source, so they can't use anything from outside their own body.
   */
  storySorts?: StorybookConfigBase['storySorts'];
  // TODO move this to params
  reactNative?: ReactNativeOptions;
  features?: Features;
  framework?: '@storybook/react-native';
}
