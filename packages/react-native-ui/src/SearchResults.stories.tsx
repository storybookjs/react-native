import type { StoryObj, Meta } from '@storybook/react';
import { SearchResults } from './SearchResults';
import { decorators } from './decorators';

const meta = {
  component: SearchResults,
  title: 'UI/SearchResults',
  decorators,
} satisfies Meta<typeof SearchResults>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    query: 'bubble',
    closeMenu: () => {},
    highlightedIndex: null,
    results: [
      {
        item: {
          type: 'story',
          id: 'nestingexample-message-bubble--first',
          name: 'First',
          title: 'NestingExample/Message/bubble',
          importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
          tags: ['story'],
          depth: 3,
          parent: 'nestingexample-message-bubble',
          prepared: false,
          refId: 'storybook_internal',
          path: ['NestingExample', 'Message', 'bubble'],
          status: null,
        },
        refIndex: 46,
        matches: [
          {
            indices: [[0, 5]],
            value: 'bubble',
            key: 'path',
            refIndex: 2,
          },
        ],
        score: 0.000020134092876783674,
      },
    ],
    getItemProps: () => ({
      icon: 'story',
      result: {
        item: {
          type: 'story',
          id: 'nestingexample-message-bubble--first',
          name: 'First',
          title: 'NestingExample/Message/bubble',
          importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
          tags: ['story'],
          depth: 3,
          parent: 'nestingexample-message-bubble',
          prepared: false,
          refId: 'storybook_internal',
          path: ['NestingExample', 'Message', 'bubble'],
          status: null,
        },
        refIndex: 46,
        matches: [
          {
            indices: [[0, 5]],
            value: 'bubble',
            key: 'path',
            refIndex: 2,
          },
        ],
        score: 0.000020134092876783674,
      },
      score: 0.000020134092876783674,
      refIndex: 46,
      item: {
        type: 'story',
        id: 'nestingexample-message-bubble--first',
        name: 'First',
        title: 'NestingExample/Message/bubble',
        importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
        tags: ['story'],
        depth: 3,
        parent: 'nestingexample-message-bubble',
        prepared: false,
        refId: 'storybook_internal',
        path: ['NestingExample', 'Message', 'bubble'],
        status: null,
      },
      matches: [
        {
          indices: [[0, 5]],
          value: 'bubble',
          key: 'path',
          refIndex: 2,
        },
      ],
      isHighlighted: false,
      onPress: () => {},
    }),
  },
};
