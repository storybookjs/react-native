import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { IndexHash, State } from 'storybook/manager-api';
import { Button, type RefType } from '@storybook/react-native-ui-common';
import { Sidebar } from './Sidebar';
import { DEFAULT_REF_ID } from './constants';
import { mockDataset } from './mockdata';
import { decorators } from './decorators';

const index = mockDataset.withRoot as IndexHash;
const storyId = 'root-1-child-a2--grandchild-a1-1';

const meta = {
  component: Sidebar,
  title: 'UI/Sidebar/Sidebar',
  excludeStories: /.*Data$/,
  parameters: { layout: 'fullscreen' },
  args: {
    previewInitialized: true,
    index: index,
    storyId,
    refId: DEFAULT_REF_ID,
    refs: {},
    status: {},
    setSelection: () => {},
  },
  decorators,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

const refs: Record<string, RefType> = {
  optimized: {
    id: 'optimized',
    title: 'This is a ref',
    url: 'https://example.com',
    type: 'lazy',
    index,
    previewInitialized: true,
  },
};

const indexError = new Error('Failed to load index');

const refsError = {
  optimized: {
    ...refs.optimized,
    index: undefined as IndexHash,
    indexError,
  },
};

const refsEmpty = {
  optimized: {
    ...refs.optimized,
    index: {} as IndexHash,
  },
};

export const Simple: Story = {};

export const Loading: Story = {
  args: {
    previewInitialized: false,
    index: undefined,
  },
};

export const Empty: Story = {
  args: {
    index: {},
  },
};

export const IndexError: Story = {
  args: {
    indexError,
  },
};

export const WithRefs: Story = {
  args: {
    refs,
  },
};

export const LoadingWithRefs: Story = {
  args: {
    ...Loading.args,
    refs,
  },
};

export const LoadingWithRefError: Story = {
  args: {
    ...Loading.args,
    refs: refsError,
  },
};

export const WithRefEmpty: Story = {
  args: {
    ...Empty.args,
    refs: refsEmpty,
  },
};

export const StatusesCollapsed: Story = {
  args: {
    status: Object.entries(index).reduce<State['status']>((acc, [id, item]) => {
      if (item.type !== 'story') {
        return acc;
      }

      if (item.name.includes('B')) {
        return {
          ...acc,
          [id]: {
            addonA: { status: 'warn', title: 'Addon A', description: 'We just wanted you to know' },
            addonB: { status: 'error', title: 'Addon B', description: 'This is a big deal!' },
          },
        };
      }
      return acc;
    }, {}),
  },
};

export const StatusesOpen: Story = {
  ...StatusesCollapsed,
  args: {
    ...StatusesCollapsed.args,
    status: Object.entries(index).reduce<State['status']>((acc, [id, item]) => {
      if (item.type !== 'story') {
        return acc;
      }

      return {
        ...acc,
        [id]: {
          addonA: { status: 'warn', title: 'Addon A', description: 'We just wanted you to know' },
          addonB: { status: 'error', title: 'Addon B', description: 'This is a big deal!' },
        },
      };
    }, {}),
  },
};

export const Searching: Story = {
  ...StatusesOpen,
  parameters: { chromatic: { delay: 2200 } },
};

/**
 * Given the following sequence of events:
 * 1. Story is selected at the top of the sidebar
 * 2. The sidebar is scrolled to the bottom
 * 3. Some re-rendering happens because of a changed state/prop
 * The sidebar should remain scrolled to the bottom
 */
export const Scrolled: Story = {
  parameters: {
    // we need a very short viewport
    viewport: {
      defaultViewport: 'mobile1',
      defaultOrientation: 'landscape',
    },
  },
  args: {
    storyId: 'group-1--child-b1',
  },
  render: function Render(args) {
    const [, setState] = React.useState(0);
    return (
      <>
        <Button
          style={{ position: 'absolute', zIndex: 10 }}
          onPress={() => setState(() => Math.random())}
          text="Change state"
        />
        <Sidebar {...args} />
      </>
    );
  },
};
