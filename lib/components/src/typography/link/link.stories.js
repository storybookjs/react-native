import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Link from './link';

const onClick = action('onClick');
storiesOf('Components|Typography/Link', module)
  .add('cancel w/ onClick', () => (
    <Link cancel href="/" onClick={onClick}>
      Try clicking with different mouse buttons and modifier keys (shift/ctrl/alt/cmd)
    </Link>
  ))
  .add('cancel w/ href', () => (
    <Link cancel href="http://example.com">
      Link
    </Link>
  ))
  .add('no-cancel w/ onClick', () => (
    <Link href="/" onClick={onClick}>
      any click will go through
    </Link>
  ))
  .add('no-cancel w/ href', () => (
    <Link cancel href="http://example.com">
      Link
    </Link>
  ));
