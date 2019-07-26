/** @jsx h */
import { h } from 'preact';
import { withContexts } from '@storybook/addon-contexts/preact';

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

export default {
  title: 'Addons|Contexts',
  decorators: [withContexts(topLevelContexts)],
};

export const simpleCssTheming = () => (
  <div>I'm a children of the injected 'div' (where provides a theming context).</div>
);

simpleCssTheming.story = {
  name: 'Simple CSS Theming',

  parameters: {
    contexts: storyLevelContexts,
  },
};
