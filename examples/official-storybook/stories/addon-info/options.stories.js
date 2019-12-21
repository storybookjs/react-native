import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import FlowTypeButton from '../../components/FlowTypeButton';
import BaseButton from '../../components/BaseButton';
import TableComponent from '../../components/TableComponent';
import { markdownDescription } from './markdown.stories';

export default {
  title: 'Addons/Info/Options',
  decorators: [withInfo],
};

export const InlinesComponentInsideStory = () => <BaseButton label="Button" />;
InlinesComponentInsideStory.story = {
  name: 'Inlines component inside story',
  parameters: {
    info: {
      text: 'Component should be inlined between description and PropType table',
      inline: true, // Displays info inline vs click button to view
    },
  },
};

export const ExcludesPropTypesThatAreInTheExcludedPropTypesArray = () => (
  <BaseButton label="Button" />
);
ExcludesPropTypesThatAreInTheExcludedPropTypesArray.story = {
  name: 'Excludes propTypes that are in the excludedPropTypes array',
  parameters: {
    info: {
      text: 'Label propType should be excluded',
      excludedPropTypes: ['label'],
    },
  },
};

export const ShowsOrHidesInfoAddonHeader = () => <BaseButton label="Button" />;
ShowsOrHidesInfoAddonHeader.story = {
  name: 'Shows or hides Info Addon header',
  parameters: {
    info: {
      text: 'The Info Addon header should be hidden',
      header: false, // Toggles display of header with component name and description
    },
  },
};

export const ShowsOrHidesInfoAddonSource = () => <BaseButton label="Button" />;
ShowsOrHidesInfoAddonSource.story = {
  name: 'Shows or hides Info Addon source',
  parameters: {
    info: {
      text: 'The Info Addon source section should be hidden',
      source: false, // Displays the source of story Component
    },
  },
};

export const ShowsAdditionalComponentPropTables = () => <BaseButton label="Button" />;
ShowsAdditionalComponentPropTables.story = {
  name: 'Shows additional component prop tables',
  parameters: {
    info: {
      text: 'There should be a prop table added for a component not included in the story',
      propTables: [FlowTypeButton],
    },
  },
};

export const ExcludeComponentFromPropTables = () => (
  <div>
    <BaseButton label="Button" />
    <FlowTypeButton label="Flow Typed Button" />
  </div>
);
ExcludeComponentFromPropTables.story = {
  name: 'Exclude component from prop tables',
  parameters: {
    info: {
      text: 'This can exclude extraneous components from being displayed in prop tables.',
      propTablesExclude: [FlowTypeButton],
    },
  },
};

export const ExtendInfoStylesWithAnObject = () => <BaseButton label="Button" />;
ExtendInfoStylesWithAnObject.story = {
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

export const FullControlOverStylesUsingAFunction = () => <BaseButton label="Button" />;
FullControlOverStylesUsingAFunction.story = {
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

export const UseACustomComponentForTheTable = () => <BaseButton label="Button" />;
UseACustomComponentForTheTable.story = {
  name: 'Use a custom component for the table',
  component: TableComponent,
  parameters: {
    info: {
      TableComponent,
    },
  },
};

export const UseInfoAsStoryDecorator = () => <BaseButton label="Button" />;

UseInfoAsStoryDecorator.story = {
  name: 'Use Info as story decorator',
  decorators: [withInfo('Info can take options via the global or local decorator as well.')],
};

export const UsingParametersAcrossAllStories = () => <BaseButton label="Button" />;
UsingParametersAcrossAllStories.story = {
  name: 'Using parameters across all stories',
};

export const OverwritingAndExtendingTheParametersAndOptionsSetStoriesWise = () => (
  <BaseButton label="Button" />
);
OverwritingAndExtendingTheParametersAndOptionsSetStoriesWise.story = {
  name: 'Overwriting and extending the parameters and options set stories-wise',
  parameters: {
    info: {
      text: 'Label propType should be excluded',
      excludedPropTypes: ['label'],
    },
  },
};

export const OverwriteTheParametersWithMarkdownVariable = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

OverwriteTheParametersWithMarkdownVariable.story = {
  name: 'Overwrite the parameters with markdown variable',
  parameters: { info: markdownDescription },
};

export const OverwriteTheTextParameterWithMarkdownInline = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

OverwriteTheTextParameterWithMarkdownInline.story = {
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

export const DisableTheAddonEntirely = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);
DisableTheAddonEntirely.story = {
  name: 'Disable the addon entirely',
  parameters: { info: { disable: true } },
};
