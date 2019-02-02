import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'fast-deep-equal';

import { STORY_RENDERED } from '@storybook/core-events';

import ActionLoggerComponent from '../../components/ActionLogger';
import { EVENT_ID } from '../..';

interface ActionLoggerProps {
  active: boolean;
  api: {
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
  };
}

interface ActionLoggerState {
  actions: any[];
}

export default class ActionLogger extends Component<ActionLoggerProps, ActionLoggerState> {
  private mounted: boolean;

  constructor(props: ActionLoggerProps) {
    super(props);

    this.state = { actions: [] };
  }

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

  addAction = (action: { data: any; count: number; options: { limit: number; }; }) => {
    let { actions = [] } = this.state;
    actions = [...actions];

    const previous = actions.length && actions[0];

    if (previous && deepEqual(previous.data, action.data)) {
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

(ActionLogger as any).propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    on: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
