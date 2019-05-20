import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import NotificationItem from './item';

const List = styled.div(
  {
    zIndex: 10,

    '> * + *': {
      marginTop: 10,
    },
    '&:empty': {
      display: 'none',
    },
  },
  ({ placement }) =>
    placement || {
      bottom: 0,
      left: 0,
      right: 0,
      position: 'fixed',
    }
);

export default function NotificationList({ notifications, placement }) {
  return (
    <List placement={placement}>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </List>
  );
}

NotificationList.propTypes = {
  placement: PropTypes.shape({
    position: PropTypes.string,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
  }),
  notifications: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired)
    .isRequired,
};
NotificationList.defaultProps = {
  placement: undefined,
};
