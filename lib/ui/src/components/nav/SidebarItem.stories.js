import React from 'react';
import { storiesOf } from '@storybook/react';

import SidebarItem from './SidebarItem';

storiesOf('UI|Sidebar/SidebarItem', module)
  .addDecorator(storyFn => (
    <div style={{ width: '240px', padding: '20px', background: '#eee' }}>{storyFn()}</div>
  ))
  .add('folder', () => <SidebarItem name="Folder" depth={0} type="folder" isExpandable />)
  .add('component', () => <SidebarItem name="Component" depth={0} type="component" isExpandable />)
  .add('component isExpanded', () => (
    <SidebarItem name="Component" depth={0} type="component" isExpandable isExpanded />
  ))
  .add('story', () => <SidebarItem name="Story" depth={0} type="story" />)
  .add('story isSelected', () => <SidebarItem name="Story" depth={0} type="story" isSelected />)
  .add('nested depths', () => (
    <div>
      <SidebarItem name="Depth 0" depth={0} type="folder" />
      <SidebarItem name="Depth 0" depth={0} type="folder" isExpandable />
      <SidebarItem name="Depth 0" depth={0} type="folder" isExpandable isExpanded />
      <SidebarItem name="Depth 1" depth={1} type="folder" isExpandable />
      <SidebarItem name="Depth 2" depth={2} type="folder" isExpandable />
      <SidebarItem name="Depth 3" depth={3} type="folder" isExpandable />
    </div>
  ))
  .add('loading', () => <SidebarItem name="TODO Loading" depth={0} type="story" />);
