// Resolves to window in browser and to global in node
import global from 'global';
// import { TabWrapper } from '@storybook/components';

export mockChannel from './storybook-channel-mock';
export { makeDecorator } from './make-decorator';

export class AddonStore {
  constructor() {
    this.loaders = {};
    this.panels = {};
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

  getPanels() {
    return this.panels;
  }

  addPanel(name, panel) {
    // supporting legacy addons, which have not migrated to the active-prop
    // const original = panel.render;
    // if (original && original.toString() && !original.toString().match(/active/)) {
    //  this.panels[name] = {
    //    ...panel,
    //    render: ({ active }) => TabWrapper({ active, render: original }),
    //  };
    // } else {
    this.panels[name] = panel;
    // }
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
