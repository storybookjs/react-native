import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from '../index';

const stories = storiesOf('<Story />', module);

stories.add('Basic Usage', function (context) {
  const info = `
    The \`<Story>\` component can be used to show additional information with
    your stories. To render text here, provide your markdown formatted text
    as \`info\` property. Make sure to provide the story context variable as the
    \`context\` property to automatically add titles.
  `;

  return (
    <Story context={context} info={info}>
      <em>Click the "?" button on top-right corner for <span style={{textDecoration: 'underline'}}>more information</span> about this story</em>
    </Story>
  );
});

stories.add('Show Inline', function (context) {
  const info = `
    To show your story information immmediately after yout story elements
    set the \`showInline\` boolean property to true. This will render this text,
    source code and prop-tables (if provider). Info styles will be adjusted
    to suit and the headers will be omitted.
  `;

  return (
    <Story info={info} showInline={true}>
      <em>You can also show story info immediately after your example</em>
    </Story>
  );
});

stories.add('Prop Tables', function (context) {
  const info = `
    You can also automatically generate propType tables for components.
    Just provide an array of react components as \`propTables\` property
    to the story component.
  `;

  return (
    <Story info={info} propTables={[Story]} showInline={true}>
      <em>Click the "?" button on top-right corner for more info</em>
    </Story>
  );
});
