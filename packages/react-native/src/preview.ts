import { Platform } from 'react-native';
// `argTypesEnhancers` and `parameters.docs.extractArgTypes` are exported from the
// `entry-preview-argtypes` entry point, not `entry-preview-docs`. Importing them
// from `entry-preview-docs` resolves to `undefined`, which silently disables
// docgen-based auto argTypes (controls then only come from core value inference).
import {
  parameters as reactParameters,
  argTypesEnhancers,
} from '@storybook/react/entry-preview-argtypes';
import { type Preview } from '@storybook/react';

// Workaround for Reanimated globals not being available on web.
// Without these, the actions panel crashes with:
// "ProgressTransitionRegister is not available on non-native platform"
if (Platform.OS === 'web') {
  // @ts-ignore
  globalThis.ProgressTransitionRegister = {};
  // @ts-ignore
  globalThis.UpdatePropsManager = {};
}

const preview: Preview = {
  argTypesEnhancers,
  parameters: {
    docs: {
      extractArgTypes: reactParameters.docs.extractArgTypes,
    },
  },
};

export default preview;
