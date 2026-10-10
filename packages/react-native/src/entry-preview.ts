import { Platform } from 'react-native';
import {
  parameters as reactArgtypeParameters,
  argTypesEnhancers,
} from '@storybook/react/entry-preview-argtypes';

// Workaround for Reanimated globals not being available on web.
// Without these, the actions panel crashes with:
// "ProgressTransitionRegister is not available on non-native platform"
if (Platform.OS === 'web') {
  // @ts-ignore
  globalThis.ProgressTransitionRegister = {};
  // @ts-ignore
  globalThis.UpdatePropsManager = {};
}

export { argTypesEnhancers };

export const parameters = {
  renderer: 'react-native',
  docs: {
    extractArgTypes: reactArgtypeParameters.docs.extractArgTypes,
  },
};
