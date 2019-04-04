import React from 'react';

import Sidebar from './Sidebar';
import * as SidebarHeadingStories from './SidebarHeading.stories';
import * as SidebarStoriesStories from './SidebarStories.stories';

export default {
  Component: Sidebar,
  title: 'UI|Sidebar/Sidebar',
};

const { menu } = SidebarHeadingStories.standard.storyData;
const { stories, storyId } = SidebarStoriesStories.withRoot.storyData;

export const simple = () => <Sidebar menu={menu} stories={stories} storyId={storyId} />;
simple.storyData = { menu, stories, storyId };

export const loading = () => <Sidebar menu={menu} stories={{}} loading />;
loading.storyData = { menu, stories: {} };
