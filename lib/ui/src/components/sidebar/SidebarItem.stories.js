import React from 'react';

import SidebarItem from './SidebarItem';

export default {
  Component: SidebarItem,
  title: 'UI|Sidebar/SidebarItem',
  decorators: [
    storyFn => (
      <div style={{ width: '240px', padding: '20px', background: '#eee' }}>{storyFn()}</div>
    ),
  ],
};

export const group = () => <SidebarItem name="Group" depth={0} />;
export const component = () => <SidebarItem name="Component" depth={0} isComponent />;
export const componentExpanded = () => (
  <SidebarItem name="Component" depth={0} isComponent isExpanded />
);
export const story = () => <SidebarItem name="Story" depth={0} isStory />;
export const storySelected = () => <SidebarItem name="Story" depth={0} isStory isSelected />;
export const nestedDepths = () => (
  <div>
    <SidebarItem name="Depth 0" depth={0} />
    <SidebarItem name="Depth 0" depth={0} />
    <SidebarItem name="Depth 0" depth={0} isExpanded />
    <SidebarItem name="Depth 1" depth={1} isExpanded />
    <SidebarItem name="Depth 2" depth={2} isExpanded />
    <SidebarItem name="Depth 3" depth={3} />
  </div>
);
export const loading = () => <SidebarItem loading />;
