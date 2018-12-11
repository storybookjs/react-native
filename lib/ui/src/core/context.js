import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { STORY_CHANGED } from '@storybook/core-events';

import initProviderApi from './init-provider-api';
import initKeyHandler from './init-key-handler';

import getInitialState from './initial-state';

import initAddons from './addons';
import initChannel from './channel';
import initStories from './stories';
import initLayout from './layout';
import initURL from './url';

const Context = React.createContext({ api: undefined, state: getInitialState({}) });

export class Provider extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    provider: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}).isRequired,
    path: PropTypes.string,
    viewMode: PropTypes.oneOf(['components', 'info']),
    componentId: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  };

  static defaultProps = {
    viewMode: undefined,
    componentId: undefined,
    path: undefined,
  };

  constructor(props) {
    super(props);
    const { provider, location, path, viewMode, componentId, navigate } = props;

    const store = {
      getState: () => this.state,
      setState: (a, b) => this.setState(a, b),
    };

    const apiData = {
      navigate,
      store,
      provider,
      location,
      path,
      viewMode,
      componentId,
    };

    const channel = initChannel(apiData);
    const addons = initAddons(apiData);
    const layout = initLayout(apiData);
    const stories = initStories(apiData);
    const url = initURL(apiData);

    const state = getInitialState(
      channel.state,
      url.state,
      addons.state,
      layout.state,
      stories.state
    );

    const combo = {
      navigate,
      ...channel.api,
      ...url.api,
      ...addons.api,
      ...layout.api,
      ...stories.api,
    };

    const eventHandler = initKeyHandler({ store, api: combo });
    const api = initProviderApi({ provider, store, api: combo, eventHandler });

    api.on(STORY_CHANGED, id => {
      const options = api.getParameters(id, 'options');

      api.setOptions(options);
    });

    this.state = state;
    this.api = api;
    this.eventHandler = eventHandler;
  }

  componentDidMount() {
    this.eventHandler.bind();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { state: prevState, props: prevProps } = this;

    if (prevState !== nextState) {
      return true;
    }
    if (prevProps.path !== nextProps.path) {
      return true;
    }
    return false;
  }

  static getDerivedStateFromProps = (props, state) => {
    if (state.path !== props.path) {
      return {
        ...state,
        location: props.location,
        path: props.path,
        viewMode: props.viewMode,
        componentId: props.componentId,
      };
    }
    return null;
  };

  render() {
    const { children } = this.props;
    const value = {
      state: this.state,
      api: this.api,
    };

    return (
      <Context.Provider value={value}>
        {typeof children === 'function' ? children(value) : children}
      </Context.Provider>
    );
  }
}
Provider.displayName = 'Manager';

export const { Consumer } = Context;
