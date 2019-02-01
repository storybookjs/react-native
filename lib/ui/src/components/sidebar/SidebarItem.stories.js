import React from 'react';

import SidebarItem from './SidebarItem';

export default {
  Component: SidebarItem,
  title: 'UI|Sidebar/SidebarItem',
  decorators: [
    storyFn => (
      <div style={{ width: '240px', margin: '1rem', background: '#eee' }}>{storyFn()}</div>
    ),
  ],
};

export const group = () => <SidebarItem name="Group" />;
export const component = () => <SidebarItem name="Component" isComponent />;
export const componentExpanded = () => <SidebarItem name="Component" isComponent isExpanded />;
export const story = () => <SidebarItem name="Story" isStory />;
export const storySelected = () => <SidebarItem name="Story" isStory isSelected />;
export const longName = () => (
  <SidebarItem
    name="Story with a long and windy name that is descriptive, precise, and readable. "
    isComponent
  />
);
export const nestedDepths = () => (
  <div>
    <SidebarItem name="Depth 0 collapsed" depth={0} />
    <SidebarItem name="Depth 0 expanded" depth={0} isExpanded />
    <SidebarItem name="Depth 1 expanded" depth={1} isExpanded />
    <SidebarItem name="Depth 2 expanded" depth={2} isComponent isExpanded />
    <SidebarItem name="Depth 3" depth={3} isStory />
  </div>
);
export const loading = () => <SidebarItem loading />;
