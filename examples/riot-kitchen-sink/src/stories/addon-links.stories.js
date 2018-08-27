import { storiesOf } from '@storybook/riot';
import { mount } from 'riot';
// eslint-disable-next-line no-unused-vars
import Button from './Button.tag';

storiesOf('Addon|Links', module).add('Go to welcome', () =>
  mount('root', 'my-button', {
    rounded: true,
    content: 'This button links to Welcome',
    value: 'with a parameter',
    handleClick: () => {
      global.window.location = 'iframe.html?selectedKind=Welcome&selectedStory=Welcome';
    },
  })
);
