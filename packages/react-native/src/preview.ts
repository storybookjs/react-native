// @ts-ignore this exists but for some reason typescript doesn't want to believe it
import { parameters as reactParameters } from '@storybook/react/dist/entry-preview-docs';
import { enhanceArgTypes } from '@storybook/core/docs-tools';
import { type Preview } from '@storybook/react';

const preview: Preview = {
  argTypesEnhancers: [enhanceArgTypes],
  parameters: {
    docs: {
      extractArgTypes: reactParameters.docs.extractArgTypes,
    },
  },
};

export default preview;
