import {
  parameters as reactParameters,
  argTypesEnhancers,
} from '@storybook/react/entry-preview-docs';
import { type Preview } from '@storybook/react';

const preview: Preview = {
  argTypesEnhancers,
  parameters: {
    docs: {
      extractArgTypes: reactParameters.docs.extractArgTypes,
    },
  },
};

export default preview;
