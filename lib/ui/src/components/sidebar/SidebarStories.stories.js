import React from 'react';
import { Spaced } from '@storybook/components';

import SidebarStories from './SidebarStories';
import { mockDataset } from './treeview/treeview.mockdata';

export default {
  Component: SidebarStories,
  title: 'UI|Sidebar/SidebarStories',
  decorators: [s => <Spaced>{s()}</Spaced>],
  excludeStories: /.*Data$/,
};

export const withRootData = {
  stories: mockDataset.withRoot,
  storyId: '1-12-121',
};

export const withRoot = () => <SidebarStories stories={mockDataset.withRoot} storyId="1-12-121" />;

export const noRootData = {
  stories: mockDataset.noRoot,
  storyId: '1-12-121',
};

export const noRoot = () => <SidebarStories stories={mockDataset.noRoot} storyId="1-12-121" />;

export const emptyData = {
  stories: {},
};

export const empty = () => <SidebarStories stories={{}} />;

export const loading = () => <SidebarStories loading stories={{}} />;
