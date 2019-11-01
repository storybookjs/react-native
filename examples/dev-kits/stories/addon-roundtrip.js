import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('root|group/component', module).add('variant 1', () => <div>This is variant 1</div>);

storiesOf('addons|parameter', module)
  .addParameters({
    parameter: ['foo', 'bar', 'baz'],
  })
  .add('with parameter', () => <div>This is variant 1</div>);
