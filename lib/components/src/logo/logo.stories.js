import React from 'react';
import { storiesOf } from '@storybook/react';

import { Logo } from './logo';

storiesOf('Components|Logo', module)
  .add('gray', () => <Logo />)
  .add('colored', () => <Logo colored />);
