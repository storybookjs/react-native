import {
  // @ts-ignore this exists but for some reason typescript doesn't want to believe it
  parameters as reactParameters,
  // @ts-ignore this exists but for some reason typescript doesn't want to believe it
  argTypesEnhancers,
} from '@storybook/react/dist/entry-preview-docs.mjs';
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
