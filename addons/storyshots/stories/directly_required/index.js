import React from 'react';

import { storiesOf } from '@storybook/react'; // eslint-disable-line
import { action } from '@storybook/addon-actions'; // eslint-disable-line
import { Button } from '@storybook/react/demo';

storiesOf('Another Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);
