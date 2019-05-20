import React from 'react';

import { Consumer } from '@storybook/api';

import Notifications from '../components/notifications/notifications';

export const mapper = ({ state }) => {
  const { notifications } = state;

  return {
    notifications,
  };
};

const NotificationConnect = props => (
  <Consumer filter={mapper}>{fromState => <Notifications {...props} {...fromState} />}</Consumer>
);

export default NotificationConnect;
