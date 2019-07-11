import React from 'react';
import { storiesOf } from '@storybook/react';

import SidebarSubheading from './SidebarSubheading';

storiesOf('UI|Sidebar/SidebarSubheading', module)
  .addParameters({
    component: SidebarSubheading,
  })
  .add('default', () => <SidebarSubheading>Subheading</SidebarSubheading>);
