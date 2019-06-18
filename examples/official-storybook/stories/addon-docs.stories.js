import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Docs', module)
  .addParameters({
    docs: () => <div>Hello docs</div>,
  })
  .add('default', () => <div>Click the docs tab to see the docs</div>);
