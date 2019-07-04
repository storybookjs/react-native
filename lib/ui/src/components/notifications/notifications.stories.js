import React from 'react';

import NotificationList from './notifications';
import itemMeta, * as itemStories from './item.stories';

export default {
  component: NotificationList,
  title: 'UI|Notifications/Notifications',
  decorators: [storyFn => <div style={{ width: '240px', margin: '1rem' }}>{storyFn()}</div>],
  excludeStories: /.*Data$/,
};

const items = Array.from(Object.entries(itemStories))
  .filter(entry => itemMeta.excludeStories.exec(entry[0]))
  .map(entry => entry[1]);

export const singleData = [items[0]];
export const allData = items;

export const single = () => (
  <NotificationList notifications={singleData} placement={{ position: 'relative' }} />
);

export const all = () => (
  <NotificationList notifications={allData} placement={{ position: 'relative' }} />
);

export const placement = () => (
  <NotificationList
    placement={{ position: 'fixed', left: 20, bottom: 20 }}
    notifications={allData}
  />
);
