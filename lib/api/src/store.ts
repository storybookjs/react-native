import { localStorage, sessionStorage } from 'global';
import { parse, stringify } from 'telejson';

export const STORAGE_KEY = '@storybook/ui/store';

import { State } from './index';

function get(storage: Storage) {
  const serialized = storage.getItem(STORAGE_KEY);
  return serialized ? parse(serialized) : {};
}

function set(storage: Storage, value: Patch) {
  storage.setItem(STORAGE_KEY, stringify(value, { maxDepth: 50 }));
}

function update(storage: Storage, patch: Patch) {
  const previous = get(storage);
  // Apply the same behaviour as react here
  set(storage, { ...previous, ...patch });
}

type GetState = () => State;
type SetState = (a: any, b: any) => any;

interface Storage {
  getItem(key: string): string | undefined;
  setItem(
    key: string,
    value: string
  ):
    | {
        [key: string]: any;
      }
    | undefined;
}

interface Upstream {
  getState: GetState;
  setState: SetState;
}

type Patch = Partial<State>;

type InputFnPatch = (s: State) => Patch;
type InputPatch = Patch | InputFnPatch;

interface Options {
  persistence: 'none' | 'session' | string;
}
type CallBack = (s: State) => void;
type CallbackOrOptions = CallBack | Options;

// Our store piggybacks off the internal React state of the Context Provider
// It has been augmented to persist state to local/sessionStorage
export default class Store {
  upstreamGetState: GetState;
  upstreamSetState: SetState;

  constructor({ setState, getState }: Upstream) {
    this.upstreamSetState = setState;
    this.upstreamGetState = getState;
  }

  // The assumption is that this will be called once, to initialize the React state
  // when the module is instanciated
  getInitialState(base: State) {
    // We don't only merge at the very top level (the same way as React setState)
    // when you set keys, so it makes sense to do the same in combining the two storage modes
    // Really, you shouldn't store the same key in both places
    return { ...base, ...get(localStorage), ...get(sessionStorage) };
  }

  getState() {
    return this.upstreamGetState();
  }

  async setState(inputPatch: InputPatch, options?: Options): Promise<State>;
  async setState(inputPatch: InputPatch, callback?: CallBack, options?: Options): Promise<State>;
  async setState(
    inputPatch: InputPatch,
    cbOrOptions?: CallbackOrOptions,
    inputOptions?: Options
  ): Promise<State> {
    let callback;
    let options;
    if (typeof cbOrOptions === 'function') {
      callback = cbOrOptions;
      options = inputOptions;
    } else {
      options = cbOrOptions;
    }
    const { persistence = 'none' } = options || {};

    let patch: Patch = {};
    // What did the patch actually return
    let delta: Patch = {};
    if (typeof inputPatch === 'function') {
      // Pass the same function, but just set delta on the way
      patch = (state: State) => {
        const getDelta = inputPatch as InputFnPatch;
        delta = getDelta(state);
        return delta;
      };
    } else {
      patch = inputPatch;
      delta = patch;
    }

    const newState: State = await new Promise(resolve => {
      this.upstreamSetState(patch, resolve);
    });

    if (persistence !== 'none') {
      const storage = persistence === 'session' ? sessionStorage : localStorage;
      await update(storage, delta);
    }

    if (callback) {
      callback(newState);
    }
    return newState;
  }
}
