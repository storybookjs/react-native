// TODO -- make this TS?

import { localStorage, sessionStorage } from 'global';
import { parse, stringify } from 'telejson';

export const STORAGE_KEY = '@storybook/ui/store';

function get(storage) {
  const serialized = storage.getItem(STORAGE_KEY);
  return serialized ? parse(serialized) : {};
}

function set(storage, value) {
  storage.setItem(STORAGE_KEY, stringify(value, { maxDepth: 50 }));
}

function update(storage, patch) {
  const previous = get(storage);
  // Apply the same behaviour as react here
  set(storage, { ...previous, ...patch });
}

// Our store piggybacks off the internal React state of the Context Provider
// It has been augmented to persist state to local/sessionStorage
export default class Store {
  constructor({ setState, getState }) {
    this.upstreamSetState = setState;
    this.upstreamGetState = getState;
  }

  // The assumption is that this will be called once, to initialize the React state
  // when the module is instanciated
  getInitialState() {
    // We don't only merge at the very top level (the same way as React setState)
    // when you set keys, so it makes sense to do the same in combining the two storage modes
    // Really, you shouldn't store the same key in both places
    return { ...get(localStorage), ...get(sessionStorage) };
  }

  getState() {
    return this.upstreamGetState();
  }

  async setState(inputPatch, cbOrOptions, inputOptions) {
    let callback;
    let options;
    if (typeof cbOrOptions === 'function') {
      callback = cbOrOptions;
      options = inputOptions;
    } else {
      options = cbOrOptions;
    }
    const { persistence = 'none' } = options || {};

    let patch;
    // What did the patch actually return
    let delta;
    if (typeof inputPatch === 'function') {
      // Pass the same function, but just set delta on the way
      patch = state => {
        delta = inputPatch(state);
        return delta;
      };
    } else {
      patch = inputPatch;
      delta = patch;
    }

    const newState = await new Promise(resolve => {
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
