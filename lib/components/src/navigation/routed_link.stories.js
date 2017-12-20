import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RoutedLink from './routed_link';

const onClick = action('onClick');
storiesOf('components/RoutedLink', module)
  .add('w/ onClick', () => (
    <RoutedLink href="/" onClick={onClick}>
      Try clicking with different mouse buttons and modifier keys (shift/ctrl/alt/cmd)
    </RoutedLink>
  ))
  .add('w/ href', () => <RoutedLink href="http://google.com">Link</RoutedLink>);
