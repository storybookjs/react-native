import React from 'react';

import NotificationList from './NotificationList';
import * as NotificationItemStories from './NotificationItem.stories';

export default {
  component: NotificationList,
  title: 'UI|Notifications/NotificationList',
  decorators: [storyFn => <div style={{ width: '240px', margin: '1rem' }}>{storyFn()}</div>],
};

const notifications = Object.values(NotificationItemStories)
  .filter(s => s.storyData)
  .map(({ storyData: { notification } }, index) => ({
    ...notification,
    id: index,
  }));
export const all = () => <NotificationList notifications={notifications} />;
all.storyData = { notifications };

export const single = () => <NotificationList notifications={notifications.slice(0, 1)} />;
single.storyData = { notifications: notifications.slice(0, 1) };

export const empty = () => <NotificationList notifications={[]} />;
