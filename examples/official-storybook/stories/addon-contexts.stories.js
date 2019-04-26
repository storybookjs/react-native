import React from 'react';
import { storiesOf } from '@storybook/react';
import { withContexts } from '@storybook/addon-contexts/react';

// Example A: Simple CSS Theming
const topLevelContexts = [
  {
    icon: 'sidebaralt',
    title: 'CSS Themes',
    components: ['div'],
    params: [
      {
        name: 'Desert',
        props: {
          style: { color: 'brown', background: '#F4A261', height: '100vh', padding: '10px' },
        },
      },
      {
        name: 'Ocean',
        props: {
          style: { color: 'white', background: '#173F5F', height: '100vh', padding: '10px' },
        },
        default: true,
      },
    ],
  },
];

const storyLevelContexts = [
  {
    title: 'CSS Themes',
    params: [
      {
        name: 'Forest',
        props: {
          style: { color: 'teal', background: '#00b894', height: '100vh', padding: '10px' },
        },
      },
    ],
  },
];

const stories = storiesOf('Addons|Contexts', module).addDecorator(withContexts(topLevelContexts));

stories.add(
  'Simple CSS Theming',
  () => <>I'm a children of the injected 'div' (where provides a theming context).</>,
  {
    contexts: storyLevelContexts,
  }
);

// Example B: Language (React Contexts API)
const NaiveIntlContext = React.createContext({
  locale: 'unknown',
  greeting: 'NULL',
});

stories.add(
  'Languages',
  () => (
    <NaiveIntlContext.Consumer>
      {({ locale, greeting }) => `Your locale is "${locale}", so I say "${greeting}"!`}
    </NaiveIntlContext.Consumer>
  ),
  {
    contexts: [
      {
        icon: 'globe',
        title: 'Languages',
        components: [NaiveIntlContext.Provider],
        params: [
          {
            name: 'English',
            props: {
              value: { locale: 'en', greeting: 'Hello' },
            },
          },
          {
            name: 'French',
            props: {
              value: { locale: 'fr', greeting: 'Bonjour' },
            },
          },
          {
            name: 'Chinese',
            props: {
              value: { locale: 'cn', greeting: '你好' },
            },
          },
        ],
        options: {
          cancelable: true,
        },
      },
    ],
  }
);
