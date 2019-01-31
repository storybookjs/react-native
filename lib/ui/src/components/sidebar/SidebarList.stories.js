import React from 'react';
import { storiesOf } from '@storybook/react';

import SidebarList from './SidebarList';

storiesOf('UI|Sidebar/SidebarList', module)
  .add('default', () => <SidebarList>TODO SidebarList</SidebarList>)
  .add('loading', () => <SidebarList>SidebarList loading state</SidebarList>)
  .add('empty', () => <SidebarList>SidebarList empty state</SidebarList>);
