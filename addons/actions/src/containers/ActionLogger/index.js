import React from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'fast-deep-equal';

import { STORY_RENDERED } from '@storybook/core-events';

import ActionLoggerComponent from '../../components/ActionLogger';
import { EVENT_ID } from '../..';

export default class ActionLogger extends React.Component {
  state = { actions: [] };

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(EVENT_ID, this.addAction);
    api.on(STORY_RENDERED, this.handleStoryChange);
  }

  componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(STORY_RENDERED, this.handleStoryChange);
    api.off(EVENT_ID, this.addAction);
  }

  handleStoryChange = () => {
    const { actions } = this.state;
    if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
      this.clearActions();
    }
  };

  addAction = action => {
    let { actions = [] } = this.state;
    actions = [...actions];

    const previous = actions.length && actions[0];

    if (previous && deepEqual(previous.data, action.data, { strict: true })) {
      previous.count++; // eslint-disable-line
    } else {
      action.count = 1; // eslint-disable-line
      actions.unshift(action);
    }
    this.setState({ actions: actions.slice(0, action.options.limit) });
  };

  clearActions = () => {
    this.setState({ actions: [] });
  };

  render() {
    const { actions = [] } = this.state;
    const { active } = this.props;
    const props = {
      actions,
      onClear: this.clearActions,
    };
    return active ? <ActionLoggerComponent {...props} /> : null;
  }
}

ActionLogger.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
