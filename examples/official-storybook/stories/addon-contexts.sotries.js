import React from 'react';
import { storiesOf } from '@storybook/react';
import { withContexts } from '@storybook/addon-contexts/react';

storiesOf('Addons|Contexts', module)
  .addDecorator(withContexts)
  .add('Contexts 1', () => <div>123</div>);
