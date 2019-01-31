import React from 'react';
import { storiesOf } from '@storybook/react';

import SidebarHeader from './SidebarHeader';

storiesOf('UI|Sidebar/SidebarHeader', module)
  .addDecorator(storyFn => (
    <div style={{ width: '240px', padding: '20px', background: '#eee' }}>{storyFn()}</div>
  ))
  .add('default', () => <SidebarHeader>TODO SidebarHeader</SidebarHeader>);
