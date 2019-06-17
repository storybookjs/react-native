import { document } from 'global';
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withQuery } from '@storybook/addon-queryparams';

// debugger;

storiesOf('Addons|QueryParams', module)
  .addDecorator(withQuery)
  .addParameters({
    query: {
      mock: true,
    },
  })
  .add('mock is true', () => (
    <div>This story should have an extra url query param: {document.location.search}</div>
  ))
  .add(
    'mock is 4',
    () => <div>This story should have an extra url query param: {document.location.search}</div>,
    { query: { mock: 4 } }
  );
