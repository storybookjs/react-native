import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { Button } from '@storybook/react/demo';

storiesOf('Some really long story kind description', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);
