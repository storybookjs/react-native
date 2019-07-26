import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('UI|Addon Panel', module)
  .add('default', () => <div>By default all addon panels are rendered</div>)
  .add(
    'disable panel',
    () => (
      <div>
        This story disables Actions and Accessibility panels
        <pre>
          {`storiesOf('UI|Addon Panel', module)
  .add(
    'my story',
    <MyComponent />,
    { a11y: { disable: true }, actions: { disable: true } }
  );`}
        </pre>
      </div>
    ),
    { a11y: { disabled: true }, actions: { disabled: true } }
  );
