import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from '../index';

const stories = storiesOf('Story', module);

stories.add('defaults', function () {
  const info = `
    # Story

    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    ~~~jsx
    <strong>Hello World</strong>
    ~~~
  `;

  return (
    <Story info={info}>
      <strong>Hello World</strong>
    </Story>
  );
});
