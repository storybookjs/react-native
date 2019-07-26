import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import BaseButton from '../../components/BaseButton';
import { markdownDescription } from './markdown.stories';

export default {
  title: 'Addons|Info/Parameters',
  decorators: [
    withInfo({
      styles: {
        header: {
          h1: {
            color: 'green',
          },
        },
      },
    }),
  ],
  parameters: {
    info: {
      text:
        'This text should be displayed on every story and the component should be inlined between description and PropType table',
      inline: true, // Displays info inline vs click button to view
    },
  },
};

export const usingParametersAcrossAllStories = () => <BaseButton label="Button" />;
usingParametersAcrossAllStories.story = {
  name: 'Using parameters across all stories',
};

export const overwritingAndExtendingTheParametersAndOptionsSetStoriesWise = () => (
  <BaseButton label="Button" />
);
overwritingAndExtendingTheParametersAndOptionsSetStoriesWise.story = {
  name: 'Overwriting and extending the parameters and options set stories-wise',
  parameters: {
    info: {
      text: 'Label propType should be excluded',
      excludedPropTypes: ['label'],
    },
  },
};

export const overwriteTheParametersWithMarkdownVariable = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);
overwriteTheParametersWithMarkdownVariable.story = {
  name: 'Overwrite the parameters with markdown variable',
  parameters: { info: markdownDescription },
};

export const overwriteTheTextParameterWithMarkdownInline = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);
overwriteTheTextParameterWithMarkdownInline.story = {
  name: 'Overwrite the text parameter with markdown inline',
  parameters: {
    info: {
      text: `
      description or documentation about my component, supports markdown

      ~~~js
      <Button>Click Here</Button>
      ~~~
    `,
    },
  },
};

export const disableTheAddonEntirely = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);
disableTheAddonEntirely.story = {
  name: 'Disable the addon entirely',
  parameters: { info: { disable: true } },
};
