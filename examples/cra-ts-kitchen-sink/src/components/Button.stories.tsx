import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

storiesOf('Button', module).add(
  'simple button',
  () => <Button onClick={action('button clicked')}>OK</Button>,
  {
    info: { inline: true },
  }
);
