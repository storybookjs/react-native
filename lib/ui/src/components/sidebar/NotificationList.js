import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import NotificationItem, { NotificationItemSpacer } from './NotificationItem';

const List = styled.div({
  '> * + *': {
    marginTop: 10,
  },
  '&:empty': {
    display: 'none',
  },
});

export function NotificationListSpacer({ notifications }) {
  return (
    <List>
      {notifications.map(notification => (
        <NotificationItemSpacer key={notification.id} />
      ))}
    </List>
  );
}
NotificationListSpacer.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired)
    .isRequired,
};

export default function NotificationList({ notifications }) {
  return (
    <List>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </List>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired)
    .isRequired,
};
