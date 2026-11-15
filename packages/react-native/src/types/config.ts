import type { StorybookConfig as StorybookConfigBase } from 'storybook/internal/types';
import type { ReactNativeOptions } from '../Start';

export type Features = {
  /** Enable the built-in on-device backgrounds addon panel. */
  ondeviceBackgrounds?: boolean;
  /**
   * The built-in on-device Controls panel. On by default; set to `false` to turn it off.
   * `@storybook/addon-ondevice-controls` is no longer needed, and the native date picker and
   * slider are optional.
   */
  ondeviceControls?: boolean;
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
   * Sorts the stories. Each sorter only orders the stories that the sorters before it consider
   * equal. Comparator functions are copied into `storybook.requires` from their source, so they
   * can't use anything from outside their own body.
   */
  storySorts?: StorybookConfigBase['storySorts'];
  // TODO move this to params
  reactNative?: ReactNativeOptions;
  features?: Features;
  framework?: '@storybook/react-native';
}
