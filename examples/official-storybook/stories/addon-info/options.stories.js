import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import FlowTypeButton from '../../components/FlowTypeButton';
import BaseButton from '../../components/BaseButton';
import TableComponent from '../../components/TableComponent';
import { markdownDescription } from './markdown.stories';

export default {
  title: 'Addons|Info/Options',
  decorators: [withInfo],
};

export const inlinesComponentInsideStory = () => <BaseButton label="Button" />;
inlinesComponentInsideStory.story = {
  name: 'Inlines component inside story',
  parameters: {
    info: {
      text: 'Component should be inlined between description and PropType table',
      inline: true, // Displays info inline vs click button to view
    },
  },
};

export const excludesPropTypesThatAreInTheExcludedPropTypesArray = () => (
  <BaseButton label="Button" />
);
excludesPropTypesThatAreInTheExcludedPropTypesArray.story = {
  name: 'Excludes propTypes that are in the excludedPropTypes array',
  parameters: {
    info: {
      text: 'Label propType should be excluded',
      excludedPropTypes: ['label'],
    },
  },
};

export const showsOrHidesInfoAddonHeader = () => <BaseButton label="Button" />;
showsOrHidesInfoAddonHeader.story = {
  name: 'Shows or hides Info Addon header',
  parameters: {
    info: {
      text: 'The Info Addon header should be hidden',
      header: false, // Toggles display of header with component name and description
    },
  },
};

export const showsOrHidesInfoAddonSource = () => <BaseButton label="Button" />;
showsOrHidesInfoAddonSource.story = {
  name: 'Shows or hides Info Addon source',
  parameters: {
    info: {
      text: 'The Info Addon source section should be hidden',
      source: false, // Displays the source of story Component
    },
  },
};

export const showsAdditionalComponentPropTables = () => <BaseButton label="Button" />;
showsAdditionalComponentPropTables.story = {
  name: 'Shows additional component prop tables',
  parameters: {
    info: {
      text: 'There should be a prop table added for a component not included in the story',
      propTables: [FlowTypeButton],
    },
  },
};

export const excludeComponentFromPropTables = () => (
  <div>
    <BaseButton label="Button" />
    <FlowTypeButton label="Flow Typed Button" />
  </div>
);
excludeComponentFromPropTables.story = {
  name: 'Exclude component from prop tables',
  parameters: {
    info: {
      text: 'This can exclude extraneous components from being displayed in prop tables.',
      propTablesExclude: [FlowTypeButton],
    },
  },
};

export const extendInfoStylesWithAnObject = () => <BaseButton label="Button" />;
extendInfoStylesWithAnObject.story = {
  name: 'Extend info styles with an object',
  parameters: {
    info: {
      styles: {
        button: {
          base: {
            background: 'purple',
          },
        },
        header: {
          h1: {
            color: 'green',
          },
        },
      },
    },
  },
};

export const fullControlOverStylesUsingAFunction = () => <BaseButton label="Button" />;
fullControlOverStylesUsingAFunction.story = {
  name: 'Full control over styles using a function',
  parameters: {
    info: {
      styles: stylesheet => ({
        ...stylesheet,
        header: {
          ...stylesheet.header,
          h1: {
            ...stylesheet.header.h1,
            color: 'red',
          },
        },
      }),
    },
  },
};

export const useACustomComponentForTheTable = () => <BaseButton label="Button" />;
useACustomComponentForTheTable.story = {
  name: 'Use a custom component for the table',
  component: TableComponent,
  parameters: {
    info: {
      TableComponent,
    },
  },
};

export const useInfoAsStoryDecorator = () => <BaseButton label="Button" />;

useInfoAsStoryDecorator.story = {
  name: 'Use Info as story decorator',
  decorators: [withInfo('Info can take options via the global or local decorator as well.')],
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
