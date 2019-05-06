import React, { Component } from 'react';
import deepEqual from 'fast-deep-equal';

import { addons } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import { ActionDisplay, EVENT_ID } from '@storybook/addon-actions';

import { ActionLogger as ActionLoggerComponent } from '../../components/ActionLogger';

interface ActionLoggerProps {
  active: boolean;
}

interface ActionLoggerState {
  actions: ActionDisplay[];
}

const safeDeepEqual = (a: any, b: any): boolean => {
  try {
    return deepEqual(a, b);
  } catch (e) {
    return false;
  }
};

export default class ActionLogger extends Component<ActionLoggerProps, ActionLoggerState> {
  private channel = addons.getChannel();

  constructor(props: ActionLoggerProps) {
    super(props);

    this.state = { actions: [] };
  }

  componentDidMount() {
    this.channel.addListener(EVENT_ID, this.addAction);
    this.channel.addListener(STORY_RENDERED, this.handleStoryChange);
  }

  componentWillUnmount() {
    this.channel.removeListener(STORY_RENDERED, this.handleStoryChange);
    this.channel.removeListener(EVENT_ID, this.addAction);
  }

  handleStoryChange = () => {
    const { actions } = this.state;
    if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
      this.clearActions();
    }
  };

  addAction = (action: ActionDisplay) => {
    this.setState((prevState: ActionLoggerState) => {
      const actions = [...prevState.actions];
      const previous = actions.length && actions[0];
      if (previous && safeDeepEqual(previous.data, action.data)) {
        previous.count++; // eslint-disable-line
      } else {
        action.count = 1; // eslint-disable-line
        actions.unshift(action);
      }
      return { actions: actions.slice(0, action.options.limit) };
    });
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
