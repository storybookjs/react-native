import React, { ReactElement, Component, useContext, useEffect, useRef } from 'react';
import memoize from 'memoizerific';
// @ts-ignore shallow-equal is not in DefinitelyTyped
import shallowEqualObjects from 'shallow-equal/objects';

import Events from '@storybook/core-events';
import { RenderData as RouterData } from '@storybook/router';
import { Listener } from '@storybook/channels';
import initProviderApi, { SubAPI as ProviderAPI, Provider } from './init-provider-api';

import { createContext } from './context';
import Store, { Options } from './store';
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

export { Options as StoreOptions, Listener as ChannelListener };

const ManagerContext = createContext({ api: undefined, state: getInitialState({}) });

const { STORY_CHANGED, SET_STORIES, SELECT_STORY } = Events;

export type Module = StoreData &
  RouterData &
  ProviderData & {
    mode?: 'production' | 'development';
    state: State;
  };

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

interface DocsModeData {
  docsMode: boolean;
}

interface StoreData {
  store: Store;
}

interface Children {
  children: Component | ((props: Combo) => Component);
}

type StatePartial = Partial<State>;

export type Props = Children & RouterData & ProviderData & DocsModeData;

class ManagerProvider extends Component<Props, State> {
  static displayName = 'Manager';

  api: API;

  modules: any[];

  constructor(props: Props) {
    super(props);
    const {
      provider,
      location,
      path,
      viewMode = props.docsMode ? 'docs' : 'story',
      storyId,
      docsMode,
      navigate,
    } = props;

    const store = new Store({
      getState: () => this.state,
      setState: (stateChange: StatePartial, callback) => this.setState(stateChange, callback),
    });

    const routeData = { location, path, viewMode, storyId };

    // Initialize the state to be the initial (persisted) state of the store.
    // This gives the modules the chance to read the persisted state, apply their defaults
    // and override if necessary
    const docsModeState = {
      layout: { isToolshown: false, showPanel: false },
      ui: { docsMode: true },
    };
    this.state = store.getInitialState(
      getInitialState({
        ...routeData,
        ...(docsMode ? docsModeState : null),
      })
    );

    const apiData = {
      navigate,
      store,
      provider,
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
    ].map(initModule => initModule({ ...routeData, ...apiData, state: this.state }));

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
  pure?: boolean;
  children: (d: S | C) => ReactElement<any> | null;
}

interface SubState {
  [key: string]: any;
}

class ManagerConsumer extends Component<ConsumerProps<SubState, Combo>> {
  dataMemory?: (combo: Combo) => SubState;

  prevChildren?: ReactElement<any> | null;

  prevData?: SubState;

  constructor(props: ConsumerProps<SubState, Combo>) {
    super(props);
    this.dataMemory = props.filter ? memoize(10)(props.filter) : null;
  }

  render() {
    const { children, pure } = this.props;

    return (
      <ManagerContext.Consumer>
        {d => {
          const data = this.dataMemory ? this.dataMemory(d) : d;
          if (
            pure &&
            this.prevChildren &&
            this.prevData &&
            shallowEqualObjects(data, this.prevData)
          ) {
            return this.prevChildren;
          }
          this.prevChildren = children(data);
          this.prevData = data;
          return this.prevChildren;
        }}
      </ManagerContext.Consumer>
    );
  }
}

export function useStorybookState(): State {
  const { state } = useContext(ManagerContext);
  return state;
}
export function useStorybookApi(): API {
  const { api } = useContext(ManagerContext);
  return api;
}

export { ManagerConsumer as Consumer, ManagerProvider as Provider };

export interface EventMap {
  [eventId: string]: Listener;
}

function orDefault<S>(fromStore: S, defaultState: S): S {
  if (typeof fromStore === 'undefined') {
    return defaultState;
  }
  return fromStore;
}

type StateMerger<S> = (input: S) => S;

export function useAddonState<S>(addonId: string, defaultState?: S) {
  const api = useStorybookApi();
  const ref = useRef<{ [k: string]: boolean }>({});

  const existingState = api.getAddonState<S>(addonId);
  const state = orDefault<S>(existingState, defaultState);

  const setState = (newStateOrMerger: S | StateMerger<S>, options?: Options) => {
    return api.setAddonState<S>(addonId, newStateOrMerger, options);
  };

  if (typeof existingState === 'undefined' && typeof state !== 'undefined') {
    if (!ref.current[addonId]) {
      api.setAddonState<S>(addonId, state);
      ref.current[addonId] = true;
    }
  }

  return [state, setState] as [
    S,
    (newStateOrMerger: S | StateMerger<S>, options?: Options) => Promise<S>
  ];
}

export const useChannel = (eventMap: EventMap) => {
  const api = useStorybookApi();
  useEffect(() => {
    Object.entries(eventMap).forEach(([type, listener]) => api.on(type, listener));
    return () => {
      Object.entries(eventMap).forEach(([type, listener]) => api.off(type, listener));
    };
  });

  return api.emit;
};

export function useParameter<S>(parameterKey: string, defaultValue?: S) {
  const api = useStorybookApi();

  const result = api.getCurrentParameter<S>(parameterKey);
  return orDefault<S>(result, defaultValue);
}
