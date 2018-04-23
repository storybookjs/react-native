/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import { CYCLIC_KEY, retrocycle } from '../../lib';
import { isObject } from '../../lib/util';

import ActionLoggerComponent from '../../components/ActionLogger/';
import { EVENT_ID } from '../../';

export default class ActionLogger extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { actions: [] };
    this._actionListener = action => this.addAction(action);
    this._storyChangeListener = () => this.handleStoryChange();
  }

  componentDidMount() {
    this.props.channel.on(EVENT_ID, this._actionListener);
    this.props.api.onStory(this._storyChangeListener);
  }

  componentWillUnmount() {
    this.props.channel.removeListener(EVENT_ID, this._actionListener);
  }

  handleStoryChange() {
    const { actions } = this.state;
    if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
      this.clearActions();
    }
  }

  addAction(action) {
    action.data.args = action.data.args.map(arg => retrocycle(arg)); // eslint-disable-line
    const isCyclic = !!action.data.args.find(arg => isObject(arg) && arg[CYCLIC_KEY]);
    const actions = [...this.state.actions];
    const previous = actions.length && actions[0];

    if (previous && !isCyclic && deepEqual(previous.data, action.data, { strict: true })) {
      previous.count++; // eslint-disable-line
    } else {
      action.count = 1; // eslint-disable-line
      actions.unshift(action);
    }
    this.setState({ actions });
  }

  clearActions() {
    this.setState({ actions: [] });
  }

  render() {
    const props = {
      actions: this.state.actions,
      onClear: () => this.clearActions(),
    };
    return <ActionLoggerComponent {...props} />;
  }
}

ActionLogger.propTypes = {
  channel: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  api: PropTypes.shape({
    onStory: PropTypes.func.isRequired,
  }).isRequired,
};
ActionLogger.defaultProps = {
  channel: {},
};
