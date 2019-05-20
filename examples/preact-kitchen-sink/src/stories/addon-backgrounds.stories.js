/** @jsx h */

import { h } from 'preact';

import { storiesOf } from '@storybook/preact';

import Button from '../Button';

storiesOf('Addons|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ],
  })
  .add('Example 1', () => <Button>You should be able to switch backgrounds for this story</Button>)
  .add('Example 2', () => <Button>This one too!</Button>);
