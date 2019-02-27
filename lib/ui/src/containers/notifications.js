import React from 'react';

import Notifications from '../components/notifications/notifications';
import { Consumer } from '../core/context';

export const mapper = state => {
  const { notifications } = state;

  return {
    notifications,
  };
};

const NotificationConnect = props => (
  <Consumer>{({ state, api }) => <Notifications {...props} {...mapper(state, api)} />}</Consumer>
);

export default NotificationConnect;
