import React from 'react';
import { storiesOf } from '@storybook/react';

import { withDecorator } from '@storybook/addon-decorator';

storiesOf('addons|decorator', module)
  .addDecorator(withDecorator())
  .add('with decorator', () => (
    <div>This story is wrapped with a decorator that is aware of when a story updates/changes</div>
  ));
