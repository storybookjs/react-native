// Resolves to window in browser and to global in node
import global from 'global';
import { types, isSupportedType } from './types';

export mockChannel from './storybook-channel-mock';
export { makeDecorator } from './make-decorator';

export { types, isSupportedType };

export class AddonStore {
  constructor() {
    this.loaders = {};
    this.mains = {};
    this.elements = {};
    this.channel = null;
    this.preview = null;
    this.database = null;
  }

  getChannel() {
    // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
    if (!this.channel) {
      throw new Error(
        'Accessing nonexistent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel'
      );
    }
    return this.channel;
  }

  hasChannel() {
    return Boolean(this.channel);
  }

  setChannel(channel) {
    this.channel = channel;
  }

  getPreview() {
    return this.preview;
  }

  setPreview(preview) {
    this.preview = preview;
  }

  getDatabase() {
    return this.database;
  }

  setDatabase(database) {
    this.database = database;
  }

  addPanel(name, panel) {
    this.add(name, {
      type: types.PANEL,
      ...panel,
    });
  }

  add(name, options) {
    const { type } = options;
    // assert isSupportedType
    if (!this.elements[type]) {
      this.elements[type] = [];
    }
    this.elements[type].push(options);
  }

  getElements(type) {
    return this.elements[type] || [];
  }

  register(name, loader) {
    this.loaders[name] = loader;
  }

  loadAddons(api) {
    Object.keys(this.loaders)
      .map(name => this.loaders[name])
      .forEach(loader => loader(api));
  }
}

// Enforce addons store to be a singleton
const KEY = '__STORYBOOK_ADDONS';
function getAddonsStore() {
  if (!global[KEY]) {
    global[KEY] = new AddonStore();
  }
  return global[KEY];
}

export default getAddonsStore();
