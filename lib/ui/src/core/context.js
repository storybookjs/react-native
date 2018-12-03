import React, { Component } from 'react';
import PropTypes from 'prop-types';

import initProviderApi from './init-provider-api';
import legacyUrlSupport from './legacy-url-support';
import initKeyHandler from './init-key-handler';

import getInitialState from './initial-state';

import initPanels from './panels';
import initStories from './stories';
import initUi from './ui';
import initOptions from './options';

const Context = React.createContext({ api: undefined, state: getInitialState({}) });

export class Provider extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    provider: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}).isRequired,
    path: PropTypes.string.isRequired,
    viewMode: PropTypes.oneOf(['components', 'info']),
    componentId: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  };

  static defaultProps = {
    viewMode: undefined,
    componentId: undefined,
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
    };

    const state = getInitialState({ location, path, viewMode, componentId });
    const api = {
      navigate,
      getChannel() {
        return provider.channel;
      },
      getElements(type) {
        return provider.getElements(type);
      },
      ...initOptions(apiData),
      ...initUi(apiData),
      ...initPanels(apiData),
      ...initStories(apiData),
    };
    const eventHandler = initKeyHandler({ store, api });

    legacyUrlSupport(state, navigate);
    initProviderApi({ provider, store, api, eventHandler });

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
