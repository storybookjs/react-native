/** @jsx h */

import { h } from 'preact';

import Button from '../Button';

export default {
  title: 'Addons|Backgrounds',

  parameters: {
    backgrounds: [
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ],
  },
};

export const example1 = () => (
  <Button>You should be able to switch backgrounds for this story</Button>
);

example1.story = {
  name: 'Example 1',
};

export const example2 = () => <Button>This one too!</Button>;

example2.story = {
  name: 'Example 2',
};
