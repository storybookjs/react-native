import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from '../index';

const stories = storiesOf('<Story />', module);

stories.add('Basic Usage', function (context) {
  const info = `
    This is a simple example story to demonstrate how this component can be used. The \`<Story>\` component can be used to show additional information with your stories. This text is
  `;

  return (
    <Story context={{}} info={info}>
      <em>Click the "?" button on top-right corner for more info</em>
    </Story>
  );
});

stories.add('Props Table', function (context) {
  const info = `
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
  `;

  return (
    <Story context={{}} components={[Story]} info={info}>
      <em>Click the "?" button on top-right corner for more info</em>
    </Story>
  );
})
