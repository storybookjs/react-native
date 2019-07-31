import React from 'react';

import SidebarItem from './SidebarItem';

export default {
  component: SidebarItem,
  title: 'UI|Sidebar/SidebarItem',
  decorators: [
    (storyFn: any) => (
      <div style={{ width: '240px', margin: '1rem', border: '1px dotted #ccc' }}>{storyFn()}</div>
    ),
  ],
};

export const group = () => <SidebarItem name="Group" />;
export const component = () => <SidebarItem name="Component" isComponent />;
export const componentExpanded = () => <SidebarItem name="Component" isComponent isExpanded />;
export const story = () => <SidebarItem name="Story" isLeaf />;
export const storySelected = () => <SidebarItem name="Story" isLeaf isSelected />;
export const longName = () => (
  <SidebarItem
    name="Story with a long and windy name that is descriptive, precise, and readable. "
    isComponent
  />
);
longName.story = { name: 'with long name' };
export const nestedDepths = () => (
  <div>
    <SidebarItem name="Depth 0 collapsed" depth={0} />
    <SidebarItem name="Depth 0 expanded" depth={0} isExpanded />
    <SidebarItem name="Depth 1 expanded" depth={1} isExpanded />
    <SidebarItem name="Depth 2 expanded" depth={2} isComponent isExpanded />
    <SidebarItem name="Depth 3" depth={3} isLeaf />
  </div>
);
export const loading = () => <SidebarItem loading />;
