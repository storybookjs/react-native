import React from 'react';
import { Spaced } from '@storybook/components';

import StoriesExplorer from './StoriesExplorer';
import { mockDataset } from './treeview.mockdata';

export default {
  Component: StoriesExplorer,
  title: 'UI|Sidebar/StoriesExplorer',
  decorators: [s => <Spaced>{s()}</Spaced>],
};

export const withRoot = () => <StoriesExplorer stories={mockDataset.withRoot} storyId="1-12-121" />;
withRoot.storyData = {
  stories: mockDataset.withRoot,
  storyId: '1-12-121',
};

export const noRoot = () => <StoriesExplorer stories={mockDataset.noRoot} storyId="1-12-121" />;
noRoot.storyData = {
  stories: mockDataset.noRoot,
  storyId: '1-12-121',
};

export const empty = () => <StoriesExplorer stories={{}} />;
empty.storyData = {
  stories: {},
};

export const loading = () => <StoriesExplorer loading stories={{}} />;
empty.storyData = {
  stories: {},
};
