export class AddonStore {
  constructor() {
    this._loaders = {};
    this._panels = {};
    this._channel = null;
  }

  getChannel() {
    return this._channel;
  }

  setChannel(channel) {
    this._channel = channel;
  }

  getPanels() {
    return this._panels;
  }

  addPanel(name, panel) {
    this._panels[name] = panel;
  }

  register(name, loader) {
    this._loaders[name] = loader;
  }

  loadAddons(api) {
    Object.keys(this._loaders)
      .map(name => this._loaders[name])
      .forEach(loader => loader(api));
  }
}

export default new AddonStore();
