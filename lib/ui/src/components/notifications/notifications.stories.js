import React from 'react';

import NotificationList from './notifications';
import * as NotificationItemStories from './item.stories';

export default {
  component: NotificationList,
  title: 'UI|Notifications/Notifications',
  decorators: [storyFn => <div style={{ width: '240px', margin: '1rem' }}>{storyFn()}</div>],
};

const notifications = Object.values(NotificationItemStories)
  .filter(s => s.storyData)
  .map(({ storyData: { notification } }, index) => ({
    ...notification,
    id: index.toString(),
  }));

export const single = () => <NotificationList notifications={notifications.slice(0, 1)} />;
single.storyData = { notifications: notifications.slice(0, 1) };

export const all = () => <NotificationList notifications={notifications} />;
all.storyData = { notifications };

export const placement = () => (
  <NotificationList
    placement={{ position: 'fixed', left: 20, bottom: 20 }}
    notifications={notifications}
  />
);
all.storyData = { notifications };
