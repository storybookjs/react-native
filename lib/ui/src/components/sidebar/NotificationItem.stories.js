import React from 'react';
import { Icons } from '@storybook/components';

import NotificationItem from './NotificationItem';

export default {
  component: NotificationItem,
  title: 'UI|Notifications/NotificationItem',
};

function buildExample(notification) {
  const story = () => <NotificationItem notification={notification} />;
  story.storyData = { notification };
  return story;
}

export const simple = buildExample({
  content: 'Some content',
  level: 1,
});

export const withLink = buildExample({
  ...simple.storyData.notification,
  link: '/some/path',
});

export const withIcon = buildExample({
  ...simple.storyData.notification,
  icon: <Icons icon="mobile" />,
});

export const withLinkAndIcon = buildExample({
  ...withLink.storyData.notification,
  ...withIcon.storyData.notification,
});

export const levelTwo = buildExample({
  ...withLinkAndIcon.storyData.notification,
  level: 2,
});

export const levelThree = buildExample({
  ...withLinkAndIcon.storyData.notification,
  level: 3,
});
