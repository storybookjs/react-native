// TODO -- make this TS?

import { localStorage, sessionStorage } from 'global';

// NOTE that merge mutates the first argument. I think we are OK to mutate the output of xStorage.getItem
import merge from '../libs/merge';

export const STORAGE_KEY = '@storybook/ui/store';

function get(storage) {
  const serialized = storage.getItem(STORAGE_KEY);
  return serialized ? JSON.parse(serialized) : {};
}

function set(storage, value) {
  storage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function update(storage, patch) {
  const previous = get(storage);
  set(storage, merge(previous, patch));
}

// Our store piggybacks off the internal React state of the Context Provider
// It has been augmented to persist state to local/sessionStorage
export default class Store {
  constructor({ setState }) {
    this.upstreamSetState = setState;
  }

  // The assumption is that this will be called once, to initialize the React state
  // when the module is instanciated
  getInitialState() {
    return merge(get(localStorage), get(sessionStorage));
  }

  setState(patch, persistence = 'none') {
    this.upstreamSetState(patch);

    if (persistence !== 'none') {
      const storage = persistence === 'session' ? sessionStorage : localStorage;
      update(storage, patch);
    }
  }
}
