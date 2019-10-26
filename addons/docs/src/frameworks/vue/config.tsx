/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import toReact from '@egoist/vue-to-react';
import { StoryFn } from '@storybook/addons';
import { addParameters } from '@storybook/client-api';
import { extractProps } from './extractProps';

addParameters({
  docs: {
    prepareForInline: (storyFn: StoryFn) => {
      const Story = toReact(storyFn());
      return <Story />;
    },
    extractProps,
  },
});
