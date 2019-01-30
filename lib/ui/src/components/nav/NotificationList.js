import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import NotificationItem, { NotificationItemSpacer } from './NotificationItem';

export function NotificationListSpacer({ notifications }) {
  return (
    <Fragment>
      {notifications.map(notification => (
        <NotificationItemSpacer key={notification.id} />
      ))}
    </Fragment>
  );
}
NotificationListSpacer.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired)
    .isRequired,
};

export default function NotificationList({ notifications }) {
  return (
    <Fragment>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </Fragment>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired)
    .isRequired,
};
