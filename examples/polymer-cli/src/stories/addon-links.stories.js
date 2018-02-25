import { storiesOf } from '@storybook/polymer';
import { linkTo } from '@storybook/addon-links';
import { document } from 'global';

storiesOf('Addon|Links', module).add('Go to welcome', () => {
  const el = document.createElement('playground-button');
  el.addEventListener('click', linkTo('Welcome'));
  return el;
});
