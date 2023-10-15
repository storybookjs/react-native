import { parameters as reactParameters } from '@storybook/react/dist/config';
import { enhanceArgTypes } from '@storybook/docs-tools';
import { type Preview } from '@storybook/react';

export default {
  argTypesEnhancers: [enhanceArgTypes],
  parameters: {
    docs: {
      extractArgTypes: (reactParameters as any)?.docs?.extractArgTypes,
    },
  },
} satisfies Preview;
