export class AddonApi {
  constructor(store) {
    this.getContext = store.getContext.bind(store);
    this.addPanel = store.addPanel.bind(store);
  }
}

export class AddonStore {
  constructor() {
    this._loaders = {};
    this._panels = {};
    this._context = {
      channel: null,
    };
  }

  getContext() {
    return this._context;
  }

  setContext(context) {
    Object.assign(this._context, context);
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

  loadAddons() {
    const api = new AddonApi(this);
    Object.keys(this._loaders)
      .map(name => this._loaders[name])
      .forEach(loader => loader(api));
  }
}

export default new AddonStore();
