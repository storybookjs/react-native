/* eslint-disable react/no-multi-comp */
import React, { ReactElement, Component, useContext } from 'react';
import memoize from 'memoizerific';

import Events from '@storybook/core-events';
import { RenderData as RouterData } from '@storybook/router';
import initProviderApi, { SubAPI as ProviderAPI, Provider } from './init-provider-api';

import { createContext } from './context';
import Store from './store';
import getInitialState from './initial-state';

import initAddons, { SubAPI as AddonsAPI } from './modules/addons';
import initChannel, { SubAPI as ChannelAPI } from './modules/channel';
import initNotifications, {
  SubState as NotificationState,
  SubAPI as NotificationAPI,
} from './modules/notifications';
import initStories, {
  SubState as StoriesSubState,
  SubAPI as StoriesAPI,
  StoriesRaw,
} from './modules/stories';
import initLayout, { SubState as LayoutSubState, SubAPI as LayoutAPI } from './modules/layout';
import initShortcuts, {
  SubState as ShortcutsSubState,
  SubAPI as ShortcutsAPI,
} from './modules/shortcuts';
import initURL, { QueryParams, SubAPI as UrlAPI } from './modules/url';
import initVersions, {
  SubState as VersionsSubState,
  SubAPI as VersionsAPI,
} from './modules/versions';

const ManagerContext = createContext({ api: undefined, state: getInitialState({}) });

const { STORY_CHANGED, SET_STORIES, SELECT_STORY } = Events;

export type Module = StoreData &
  RouterData &
  ProviderData & { mode?: 'production' | 'development' };

export type State = Other &
  LayoutSubState &
  StoriesSubState &
  NotificationState &
  VersionsSubState &
  RouterData &
  ShortcutsSubState;

export type API = AddonsAPI &
  ChannelAPI &
  ProviderAPI &
  StoriesAPI &
  LayoutAPI &
  NotificationAPI &
  ShortcutsAPI &
  VersionsAPI &
  UrlAPI &
  OtherAPI;

interface OtherAPI {
  [key: string]: any;
}
interface Other {
  customQueryParams: QueryParams;

  [key: string]: any;
}

export interface Combo {
  api: API;
  state: State;
}

interface ProviderData {
  provider: Provider;
}

interface StoreData {
  store: Store;
}

interface Children {
  children: Component | ((props: Combo) => Component);
}

type StatePartial = Partial<State>;

export type Props = Children & RouterData & ProviderData;

class ManagerProvider extends Component<Props, State> {
  static displayName = 'Manager';

  constructor(props: Props) {
    super(props);
    const { provider, location, path, viewMode, storyId, navigate } = props;

    const store = new Store({
      getState: () => this.state,
      setState: (stateChange: StatePartial, callback) => this.setState(stateChange, callback),
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

      if (options) {
        api.setOptions(options);
      }
    });

    api.on(SET_STORIES, (data: { stories: StoriesRaw }) => {
      api.setStories(data.stories);
      const options = storyId
        ? api.getParameters(storyId, 'options')
        : api.getParameters(Object.keys(data.stories)[0], 'options');
      api.setOptions(options);
    });
    api.on(
      SELECT_STORY,
      ({ kind, story, ...rest }: { kind: string; story: string; [k: string]: any }) => {
        api.selectStory(kind, story, rest);
      }
    );

    this.state = state;
    this.api = api;
  }

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

  api: API;

  modules: any[];

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

interface ConsumerProps<S, C> {
  filter?: (combo: C) => S;
  children: (d: S | C) => ReactElement<any> | null;
}

interface SubState {
  [key: string]: any;
}

class ManagerConsumer extends Component<ConsumerProps<SubState, Combo>> {
  constructor(props: ConsumerProps<SubState, Combo>) {
    super(props);
    this.dataMemory = props.filter ? memoize(10)(props.filter) : null;
  }

  dataMemory?: (combo: Combo) => SubState;

  render() {
    const { children } = this.props;

    return (
      <ManagerContext.Consumer>
        {d => {
          const data = this.dataMemory ? this.dataMemory(d) : d;

          return children(data);
        }}
      </ManagerContext.Consumer>
    );
  }
}

export function useStorybookState(): State {
  const { state } = useContext(ManagerContext);
  return state;
}

export { ManagerConsumer as Consumer, ManagerProvider as Provider };
