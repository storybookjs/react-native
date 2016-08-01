export class AddonStore {
  constructor() {
    this._loaders = {};
    this._panels = {};
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

  loadAddons(...args) {
    Object.keys(this._loaders)
      .map(name => this._loaders[name])
      .forEach(loader => loader(...args));
  }
}

export default new AddonStore();
