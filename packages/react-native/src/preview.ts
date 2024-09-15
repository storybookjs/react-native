// @ts-ignore this exists but for some reason typescript doesn't want to believe it
import { parameters as reactParameters } from '@storybook/react/dist/entry-preview-docs.mjs';
import { type Preview } from '@storybook/react';

import { combineParameters } from '@storybook/core/preview-api';
import type { Renderer, StoryContextForEnhancers } from '@storybook/core/types';

export const enhanceArgTypes = <TRenderer extends Renderer>(
  context: StoryContextForEnhancers<TRenderer>
) => {
  const {
    component,
    argTypes: userArgTypes,
    parameters: { docs = {} },
  } = context;
  const { extractArgTypes } = docs;

  const extractedArgTypes = extractArgTypes && component ? extractArgTypes(component) : {};
  const withExtractedTypes = extractedArgTypes
    ? (combineParameters(extractedArgTypes, userArgTypes) as typeof userArgTypes)
    : userArgTypes;

  return withExtractedTypes;
};

const preview: Preview = {
  argTypesEnhancers: [enhanceArgTypes],
  parameters: {
    docs: {
      extractArgTypes: reactParameters.docs.extractArgTypes,
    },
  },
};

export default preview;
