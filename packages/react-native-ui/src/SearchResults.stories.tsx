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

// Microfuzz format: matches[0] = name highlights, matches[1] = path highlights
// Path is joined with spaces: "NestingExample Message bubble"
// "bubble" starts at index 23 (14 + 1 + 7 + 1 = 23)
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
          subtype: 'story',
          exportName: 'First',
        },
        // matches[0] = name highlights (none), matches[1] = path highlights
        matches: [[], [[23, 28]]],
        score: 0.000020134092876783674,
      },
    ],
    getItemProps: () => ({
      icon: 'story',
      score: 0.000020134092876783674,
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
        subtype: 'story',
        exportName: 'First',
      },
      matches: [[], [[23, 28]]],
      isHighlighted: false,
      onPress: () => {},
    }),
  },
};
