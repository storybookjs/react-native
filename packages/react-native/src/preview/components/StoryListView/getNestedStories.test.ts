import { StoryIndex } from '@storybook/client-api';
import { StoryGroup, filterNestedStories, getNestedStories } from './getNestedStories';

const storyIndex: StoryIndex = {
  stories: {
    'chat-message--message-first': {
      id: 'chat-message--message-first',
      importPath: './components/NestingExample/ChatMessage.stories.tsx',
      name: 'Message First',
      title: 'Chat/Message',
    },
    'chat-message--message-second': {
      id: 'chat-message--message-second',
      importPath: './components/NestingExample/ChatMessage.stories.tsx',
      name: 'Message Second',
      title: 'Chat/Message',
    },
    'chat-message-bubble--first': {
      id: 'chat-message-bubble--first',
      importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
      name: 'First',
      title: 'Chat/Message/bubble',
    },
    'chat-message-bubble--second': {
      id: 'chat-message-bubble--second',
      importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
      name: 'Second Story',
      title: 'Chat/Message/bubble',
    },
    'chat-message-reactions--message-one': {
      id: 'chat-message-reactions--message-one',
      importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
      name: 'Message One',
      title: 'Chat/Message/Reactions',
    },
    'chat-message-reactions--message-two': {
      id: 'chat-message-reactions--message-two',
      importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
      name: 'Message Two',
      title: 'Chat/Message/Reactions',
    },
    'chat-messageinput--basic': {
      id: 'chat-messageinput--basic',
      importPath: './components/NestingExample/ChatMessageMessageInput.stories.tsx',
      name: 'Basic',
      title: 'Chat/MessageInput',
    },
    'storylistview--basic': {
      id: 'storylistview--basic',
      importPath: './components/NestingExample/StoryList.stories.tsx',
      name: 'Basic',
      title: 'StoryListView',
    },
    'text-control--basic': {
      id: 'text-control--basic',
      importPath: './components/ControlExamples/Text/Text.stories.tsx',
      name: 'Basic',
      title: 'Text control',
    },
  },
  v: 3,
};

const output: StoryGroup[] = [
  {
    name: 'Chat',
    title: 'Chat/Message',
    stories: [],
    children: [
      {
        name: 'Message',
        title: 'Chat/Message',
        stories: [
          {
            name: 'Message First',
            title: 'Chat/Message',
            id: 'chat-message--message-first',
            importPath: './components/NestingExample/ChatMessage.stories.tsx',
          },
          {
            name: 'Message Second',
            title: 'Chat/Message',
            id: 'chat-message--message-second',
            importPath: './components/NestingExample/ChatMessage.stories.tsx',
          },
        ],
        children: [
          {
            name: 'bubble',
            children: [],
            title: 'Chat/Message/bubble',
            stories: [
              {
                name: 'First',
                title: 'Chat/Message/bubble',
                id: 'chat-message-bubble--first',
                importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
              },
              {
                name: 'Second Story',
                title: 'Chat/Message/bubble',
                id: 'chat-message-bubble--second',
                importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
              },
            ],
          },
          {
            name: 'Reactions',
            title: 'Chat/Message/Reactions',
            children: [],
            stories: [
              {
                name: 'Message One',
                title: 'Chat/Message/Reactions',
                id: 'chat-message-reactions--message-one',
                importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
              },
              {
                name: 'Message Two',
                title: 'Chat/Message/Reactions',
                id: 'chat-message-reactions--message-two',
                importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
              },
            ],
          },
        ],
      },
      {
        name: 'MessageInput',
        title: 'Chat/MessageInput',
        children: [],
        stories: [
          {
            name: 'Basic',
            title: 'Chat/MessageInput',
            id: 'chat-messageinput--basic',
            importPath: './components/NestingExample/ChatMessageMessageInput.stories.tsx',
          },
        ],
      },
    ],
  },
  {
    name: 'StoryListView',
    title: 'StoryListView',
    stories: [
      {
        name: 'Basic',
        title: 'StoryListView',
        id: 'storylistview--basic',
        importPath: './components/NestingExample/StoryList.stories.tsx',
      },
    ],
    children: [],
  },
  {
    title: 'Text control',
    name: 'Text control',
    stories: [
      {
        name: 'Basic',
        title: 'Text control',
        id: 'text-control--basic',
        importPath: './components/ControlExamples/Text/Text.stories.tsx',
      },
    ],
    children: [],
  },
];

test('story index to grouped list', () => {
  expect(getNestedStories(storyIndex)).toEqual(output);
});

test('filter nested stories', () => {
  expect(filterNestedStories(output, 'bubble')).toEqual([
    {
      title: 'Chat/Message',
      name: 'Chat',
      stories: [],
      children: [
        {
          title: 'Chat/Message',
          name: 'Message',
          stories: [],
          children: [
            {
              title: 'Chat/Message/bubble',
              name: 'bubble',
              children: [],
              stories: [
                {
                  name: 'First',
                  title: 'Chat/Message/bubble',
                  id: 'chat-message-bubble--first',
                  importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
                },
                {
                  name: 'Second Story',
                  title: 'Chat/Message/bubble',
                  id: 'chat-message-bubble--second',
                  importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  expect(filterNestedStories(output, 'one')).toEqual([
    {
      name: 'Chat',
      title: 'Chat/Message',
      stories: [],
      children: [
        {
          title: 'Chat/Message',
          name: 'Message',
          stories: [],
          children: [
            {
              name: 'Reactions',
              title: 'Chat/Message/Reactions',
              children: [],
              stories: [
                {
                  name: 'Message One',
                  title: 'Chat/Message/Reactions',
                  id: 'chat-message-reactions--message-one',
                  importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
});
