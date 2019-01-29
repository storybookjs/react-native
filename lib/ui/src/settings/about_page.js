import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Route } from '@storybook/router';
import { Consumer } from '@storybook/api';

import AboutScreen from './about';

// Clear a notification on mount. This could be exported by core/notifications.js perhaps?
class NotificationClearer extends Component {
  componentDidMount() {
    const { api, notificationId } = this.props;
    api.clearNotification(notificationId);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

NotificationClearer.propTypes = {
  api: PropTypes.shape({
    clearNotification: PropTypes.func.isRequired,
  }).isRequired,
  notificationId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const mapper = ({ api }) => api;

export default () => (
  <Route path="about">
    <Consumer filter={mapper}>
      {api => (
        <NotificationClearer api={api} notificationId="update">
          <AboutScreen current={api.getCurrentVersion()} latest={api.getLatestVersion()} />
        </NotificationClearer>
      )}
    </Consumer>
  </Route>
);
