import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from '@storybook/components';

import { Consumer } from '../core/context';
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

function getCurrentAndLatestVersion({ currentVersion: current, versions }) {
  const latest = Object.values(versions || {}).find(v => v.tag === 'latest') || current;
  return {
    current,
    latest,
  };
}

export default () => (
  <Router.Route path="about">
    <Consumer>
      {({ state, api }) => (
        <NotificationClearer api={api} notificationId="update">
          <AboutScreen {...getCurrentAndLatestVersion(state)} />
        </NotificationClearer>
      )}
    </Consumer>
  </Router.Route>
);
