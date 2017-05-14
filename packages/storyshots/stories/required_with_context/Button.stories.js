import React from 'react';

import { storiesOf } from '@storybook/storybook';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/storybook-addon-links';

import Button from './Button';
import Welcome from './Welcome';

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);
