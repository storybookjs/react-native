import React from 'react';

import Sidebar from './Sidebar';
import * as SidebarHeadingStories from './SidebarHeading.stories';
import * as NotificationsListStories from './NotificationList.stories';

export default {
  Component: Sidebar,
  title: 'UI|Sidebar/Sidebar',
};

const { menu } = SidebarHeadingStories.simple.storyData;
const { notifications } = NotificationsListStories.single.storyData;
// TODO: we should get stories the same way
// const { stories, storyId } = StoryExplorer.simple.storyData;
// export const simple = () => (
// <Sidebar menu={menu} notifications={notifications} stories={stories} storyId={storyId} />
// );
// simple.storyData = { menu, notifications, stories, storyId };

export const loading = () => <Sidebar menu={menu} notifications={notifications} stories={{}} />;
loading.storyData = { menu, notifications, stories: {} };
