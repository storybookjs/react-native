import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RoutedLink from './routed_link';

const onClick = action('onClick');
storiesOf('components/RoutedLink', module)
  .add('w/ onClick', () => <RoutedLink onClick={onClick}>Link</RoutedLink>)
  .add('w/ href', () => <RoutedLink href="http://google.com">Link</RoutedLink>);
