/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { StoryFn } from '@storybook/addons';
import { extractProps } from './extractProps';
import { extractComponentDescription } from '../../lib/docgen';

addParameters({
  docs: {
    // react is Storybook's "native" framework, so it's stories are inherently prepared to be rendered inline
    // NOTE: that the result is a react element. Hooks support is provided by the outer code.
    prepareForInline: (storyFn: StoryFn) => storyFn(),
    extractProps,
    extractComponentDescription,
  },
});
