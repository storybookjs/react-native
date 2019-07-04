import React from 'react';

import NotificationItem from './item';

export default {
  component: NotificationItem,
  title: 'UI|Notifications/Item',
  decorators: [storyFn => <div style={{ width: '240px', margin: '1rem' }}>{storyFn()}</div>],
  excludeStories: /.*Data$/,
};

export const simpleData = {
  id: '1',
  content: '🎉 Storybook is cool!',
};

export const longData = {
  id: '2',
  content: '🎉 This is a long message that extends over two lines!',
};

export const linkData = {
  id: '3',
  content: '🎉 Storybook X.X is available! Download now »',
  link: '/some/path',
};

export const simple = () => <NotificationItem notification={simpleData} />;

export const longText = () => <NotificationItem notification={longData} />;

export const withLink = () => <NotificationItem notification={linkData} />;
