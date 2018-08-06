/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import { CYCLIC_KEY, retrocycle } from '../../lib';
import { isObject } from '../../lib/util';

import ActionLoggerComponent from '../../components/ActionLogger';
import { EVENT_ID } from '../..';

export default class ActionLogger extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { actions: [] };
    this._actionListener = action => this.addAction(action);
    this._storyChangeListener = () => this.handleStoryChange();
  }

  componentDidMount() {
    const { channel, api } = this.props;

    channel.on(EVENT_ID, this._actionListener);
    this.stopListeningOnStory = api.onStory(this._storyChangeListener);
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener(EVENT_ID, this._actionListener);
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }
  }

  handleStoryChange() {
    const { actions } = this.state;
    if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
      this.clearActions();
    }
  }

  addAction(action) {
    let { actions = [] } = this.state;
    actions = [...actions];

    action.data.args = action.data.args.map(arg => retrocycle(arg)); // eslint-disable-line
    const isCyclic = !!action.data.args.find(arg => isObject(arg) && arg[CYCLIC_KEY]);
    const previous = actions.length && actions[0];

    if (previous && !isCyclic && deepEqual(previous.data, action.data, { strict: true })) {
      previous.count++; // eslint-disable-line
    } else {
      action.count = 1; // eslint-disable-line
      actions.unshift(action);
    }
    this.setState({ actions: actions.slice(0, action.options.limit) });
  }

  clearActions() {
    this.setState({ actions: [] });
  }

  render() {
    const { actions = [] } = this.state;
    const { active } = this.props;
    const props = {
      actions,
      onClear: () => this.clearActions(),
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
