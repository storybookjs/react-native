import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Events, { STORIES_CONFIGURED } from '@storybook/core-events';

import initProviderApi from './init-provider-api';

import Store from './store';
import getInitialState from './initial-state';

import initAddons from './addons';
import initChannel from './channel';
import initNotifications from './notifications';
import initStories from './stories';
import initLayout from './layout';
import initShortcuts from './shortcuts';
import initURL from './url';
import initVersions from './versions';

const Context = React.createContext({ api: undefined, state: getInitialState({}) });

const { STORY_CHANGED, SET_STORIES, SELECT_STORY } = Events;

export class Provider extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    provider: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}).isRequired,
    path: PropTypes.string,
    viewMode: PropTypes.oneOf(['story', 'info']),
    storyId: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  };

  static defaultProps = {
    viewMode: undefined,
    storyId: undefined,
    path: undefined,
  };

  constructor(props) {
    super(props);
    const { provider, location, path, viewMode, storyId, navigate } = props;

    const store = new Store({
      getState: () => this.state,
      setState: (a, b) => this.setState(a, b),
    });

    // Initialize the state to be the initial (persisted) state of the store.
    // This gives the modules the chance to read the persisted state, apply their defaults
    // and override if necessary

    const apiData = {
      navigate,
      store,
      provider,
      location,
      path,
      viewMode,
      storyId,
    };

    this.state = store.getInitialState();

    this.modules = [
      initChannel,
      initAddons,
      initLayout,
      initNotifications,
      initShortcuts,
      initStories,
      initURL,
      initVersions,
    ].map(initModule => initModule(apiData));

    // Create our initial state by combining the initial state of all modules, then overlaying any saved state
    const state = getInitialState(...this.modules.map(m => m.state));

    // Get our API by combining the APIs exported by each module
    const combo = Object.assign({ navigate }, ...this.modules.map(m => m.api));

    const api = initProviderApi({ provider, store, api: combo });

    api.on(STORY_CHANGED, id => {
      const options = api.getParameters(id, 'options');

      api.setOptions(options);
    });

    api.on(SET_STORIES, data => {
      api.setStories(data.stories);

      const options = storyId
        ? api.getParameters(storyId, 'options')
        : api.getParameters(Object.keys(data.stories)[0], 'options');

      api.setOptions(options);
    });
    api.on(STORIES_CONFIGURED, () => {
      store.setState({ storiesConfigured: true });
    });
    api.on(SELECT_STORY, ({ kind, story, ...rest }) => {
      api.selectStory(kind, story, rest);
    });

    this.state = state;
    this.api = api;
  }

  componentDidMount() {
    // Now every module has had a chance to set its API, call init on each module which gives it
    // a chance to do things that call other modules' APIs.
    this.modules.forEach(({ init }) => {
      if (init) {
        init({ api: this.api });
      }
    });
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
        storyId: props.storyId,
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
