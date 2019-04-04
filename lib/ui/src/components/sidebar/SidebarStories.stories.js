import React from 'react';
import { Spaced } from '@storybook/components';

import SidebarStories from './SidebarStories';
import { mockDataset } from './treeview/treeview.mockdata';

export default {
  Component: SidebarStories,
  title: 'UI|Sidebar/SidebarStories',
  decorators: [s => <Spaced>{s()}</Spaced>],
};

export const withRoot = () => <SidebarStories stories={mockDataset.withRoot} storyId="1-12-121" />;
withRoot.storyData = {
  stories: mockDataset.withRoot,
  storyId: '1-12-121',
};

export const noRoot = () => <SidebarStories stories={mockDataset.noRoot} storyId="1-12-121" />;
noRoot.storyData = {
  stories: mockDataset.noRoot,
  storyId: '1-12-121',
};

export const empty = () => <SidebarStories stories={{}} />;
empty.storyData = {
  stories: {},
};

export const loading = () => <SidebarStories loading stories={{}} />;
empty.storyData = {
  stories: {},
};
