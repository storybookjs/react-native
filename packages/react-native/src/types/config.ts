import type { Preset, StorybookConfig as StorybookConfigBase } from 'storybook/internal/types';
import type { ReactNativeOptions } from '../Start';

export interface StorybookConfig {
  stories: StorybookConfigBase['stories'];
  addons: Preset[];
  // TODO remove this
  reactNative?: ReactNativeOptions;
  framework?: '@storybook/react-native';
}
