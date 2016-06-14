import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from '../index';

const stories = storiesOf('<Story />', module);

stories.add('basic-usage', function () {
  const info = `
    # <Story />

    ## Basic Usage

    This is a simple example story to demonstrate how this component can be used. The \`<Story>\` component can be used to attach additional information with your stories.

    Information such as example source code

    ~~~jsx
    stories.add('basic-usage', function () {
      const info = \`
        # Story
        This is a simple example story to...
      \`;

      return (
        <Story info={info}>
          <em>Click the "?" button on top-right corner</em>
        </Story>
      );
    });
    ~~~

    component properties

    | property | type   | required | default |
    |----------|--------|----------|---------|
    | info     | string | no       | ""      |

    or something else...
  `;

  return (
    <Story info={info}>
      <em>Click the "?" button on top-right corner</em>
    </Story>
  );
});
