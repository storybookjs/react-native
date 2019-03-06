import React, { Component } from 'react';
import memoize from 'memoizerific';

import Events from '@storybook/core-events';
import { RenderData as RouterData } from '@storybook/router';
import { Collection, Types } from '@storybook/addons';
import initProviderApi from './init-provider-api';

import { createContext } from './context';
import Store from './store';
import getInitialState from './initial-state';

import initAddons from './modules/addons';
import initChannel from './modules/channel';
import initNotifications, { Notification } from './modules/notifications';
import initStories, { SubState as StoriesSubState } from './modules/stories';
import initLayout, { SubState as LayoutSubState } from './modules/layout';
import initShortcuts, { Shortcuts } from './modules/shortcuts';
import initURL, { QueryParams } from './modules/url';
import initVersions, { SubState as VersionsSubState } from './modules/versions';

const ManagerContext = createContext({ api: undefined, state: getInitialState({}) });

const { STORY_CHANGED, SET_STORIES, SELECT_STORY } = Events;

export type Module = StoreData & RouterData & ProviderData;

export type State = Other & LayoutSubState & StoriesSubState & VersionsSubState & RouterData;

interface Other {
  shortcuts: Shortcuts;

  customQueryParams: QueryParams;

  notifications: Notification[];

  versions: {
    latest: any;
    current: any;
  };
  lastVersionCheck: any;
  dismissedVersionNotification: any;

  [key: string]: any;
}

export interface API {
  [key: string]: any;
}
export interface Combo {
  api: API;
  state: State;
}

interface Provider {
  handleAPI(api: API): void;
  renderPreview(): void;
  getElements(type: Types): Collection;
  [key: string]: any;
}

interface ProviderData {
  provider: Provider;
}

interface StoreData {
  store: Store;
}

interface Children {
  children: React.Component | ((props: Combo) => React.Component);
}

type Props = Children & RouterData & ProviderData;

class ManagerProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { provider, location, path, viewMode, storyId, navigate } = props;

    const store = new Store({
      getState: () => this.state,
      setState: (a: any, b: any) => this.setState(a, b),
    });

    // Initialize the state to be the initial (persisted) state of the store.
    // This gives the modules the chance to read the persisted state, apply their defaults
    // and override if necessary
    this.state = store.getInitialState(getInitialState({}));

    const apiData = {
      navigate,
      store,
      provider,
      location,
      path,
      viewMode,
      storyId,
    };

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

    api.on(STORY_CHANGED, (id: string) => {
      const options = api.getParameters(id, 'options');

      api.setOptions(options);
    });

    api.on(SET_STORIES, (data: any) => {
      api.setStories(data.stories);
    });
    api.on(SELECT_STORY, ({ kind, story, ...rest }: { [k: string]: any }) => {
      api.selectStory(kind, story, rest);
    });

    this.state = state;
    this.api = api;
  }

  static displayName = 'Manager';
  api: API;
  modules: any[];

  static getDerivedStateFromProps = (props: Props, state: State) => {
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

  componentDidMount() {
    // Now every module has had a chance to set its API, call init on each module which gives it
    // a chance to do things that call other modules' APIs.
    this.modules.forEach(({ init }) => {
      if (init) {
        init({ api: this.api });
      }
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const prevState = this.state;
    const prevProps = this.props;

    if (prevState !== nextState) {
      return true;
    }
    if (prevProps.path !== nextProps.path) {
      return true;
    }
    return false;
  }

  render() {
    const { children } = this.props;
    const value = {
      state: this.state,
      api: this.api,
    };

    return (
      <ManagerContext.Provider value={value}>
        {typeof children === 'function' ? children(value) : children}
      </ManagerContext.Provider>
    );
  }
}

interface ConsumerProps<A> {
  filter: (c: Combo) => A;
  children: (d: A) => React.ReactElement<any>;
}

const ObjectToArray = memoize(100)((obj: object) =>
  Object.entries(obj).reduce((acc, [k, v]) => acc.concat([k, v]), [])
);

const ArrayToObject = memoize(100)((array: any[]) =>
  array.reduce((acc, item, index, list) => {
    // is odd = value
    if (index % 2 !== 0) {
      const key = list[list.indexOf(item) - 1];
      acc[key] = item;
    }
    return acc;
  }, {})
);

class ManagerConsumer extends Component<ConsumerProps<any>> {
  renderMemory: (...args: any[]) => any;
  dataMemory: (...args: any[]) => any;

  constructor(props: ConsumerProps<any>) {
    super(props);
    this.renderMemory = memoize(10)((...args: any[]) => props.children(ArrayToObject(args)));
    this.dataMemory = memoize(10);
  }

  render() {
    const { children, filter } = this.props;

    return (
      <ManagerContext.Consumer>
        {d => {
          const data = filter ? this.dataMemory(filter)(d) : d;

          return filter ? this.renderMemory(...ObjectToArray(data)) : children(d);
        }}
      </ManagerContext.Consumer>
    );
  }
}

export { ManagerConsumer as Consumer, ManagerProvider as Provider };
