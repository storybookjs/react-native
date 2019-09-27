import React from 'react';
import { Spaced } from '@storybook/components';

import SidebarStories from './SidebarStories';
import { mockDataset } from './treeview/treeview.mockdata';

export default {
  component: SidebarStories,
  title: 'UI|Sidebar/SidebarStories',
  decorators: [s => <Spaced>{s()}</Spaced>],
  excludeStories: /.*Data$/,
};

export const withRootData = {
  stories: mockDataset.withRoot,
  storyId: '1-12-121',
};

export const withRoot = () => (
  <SidebarStories stories={mockDataset.withRoot} storyId="1-12-121" loading={false} />
);

export const noRootData = {
  stories: mockDataset.noRoot,
  storyId: '1-12-121',
};

export const noRoot = () => (
  <SidebarStories stories={mockDataset.noRoot} storyId="1-12-121" loading={false} />
);

export const emptyData = {
  stories: {},
};

export const empty = () => <SidebarStories stories={{}} loading={false} />;

export const loading = () => <SidebarStories loading stories={{}} />;
