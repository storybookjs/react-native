import { Platform } from 'react-native';
import {
  parameters as reactParameters,
  argTypesEnhancers,
} from '@storybook/react/entry-preview-docs';
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
