import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { STORY_CHANGED, SET_STORIES, SELECT_STORY, APPLY_SHORTCUT } from '@storybook/core-events';

import initProviderApi from './init-provider-api';
import initKeyHandler from './init-key-handler';

import getInitialState from './initial-state';

import initAddons from './addons';
import initChannel from './channel';
import initNotifications from './notifications';
import initStories from './stories';
import initLayout from './layout';
import initURL from './url';
import initVersions from './versions';

const Context = React.createContext({ api: undefined, state: getInitialState({}) });

export class Provider extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    provider: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}).isRequired,
    path: PropTypes.string,
    viewMode: PropTypes.oneOf(['components', 'info']),
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
      storyId,
    };

    const modules = [
      initChannel,
      initAddons,
      initLayout,
      initNotifications,
      initStories,
      initURL,
      initVersions,
    ].map(initModule => initModule(apiData));

    // Create our initial state by combining the initial state of all modules
    const state = getInitialState(...modules.map(m => m.state));

    // Get our API by combining the APIs exported by each module
    const combo = Object.assign({ navigate }, ...modules.map(m => m.api));

    const eventHandler = initKeyHandler({ store, api: combo });
    const api = initProviderApi({ provider, store, api: combo, eventHandler });

    api.on(STORY_CHANGED, id => {
      const options = api.getParameters(id, 'options');

      api.setOptions(options);
    });

    api.on(SET_STORIES, data => {
      api.setStories(data.stories);
    });
    api.on(SELECT_STORY, ({ kind, story, ...rest }) => {
      api.selectStory(kind, story, rest);
    });
    api.on(APPLY_SHORTCUT, data => {
      api.handleShortcut(data.event);
    });

    // Now every module has had a chance to set its API, call init on each module which gives it
    // a chance to do things that call other modules' APIs.
    modules.forEach(({ init }) => {
      if (init) {
        init({
          ...apiData,
          api,
        });
      }
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
