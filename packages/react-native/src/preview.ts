import { parameters as reactParameters } from '@storybook/react/dist/entry-preview-docs';
import { enhanceArgTypes } from '@storybook/docs-tools';
import { type Preview } from './types/public-types';

export default {
  argTypesEnhancers: [enhanceArgTypes],
  parameters: {
    docs: {
      extractArgTypes: reactParameters.docs.extractArgTypes,
    },
  },
} satisfies Preview;
