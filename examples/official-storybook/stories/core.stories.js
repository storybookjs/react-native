import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('core/options', module).add(
  'passed to story',
  ({ options: { myOption } }) => (
    <div>
      Value of <code>myOption</code> is '<code>{myOption}</code>'
    </div>
  ),
  { myOption: 'value' }
);
