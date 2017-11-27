import React from 'react';
import { storiesOf } from '@storybook/react';

import MenuLink from './menu_link';

storiesOf('components/MenuLink', module)
  .add('default', () => <MenuLink href="http://google.com">Link</MenuLink>)
  .add('active', () => (
    <MenuLink active href="http://google.com">
      Link
    </MenuLink>
  ));
