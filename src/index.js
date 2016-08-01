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
    this._context = context;
  }

  register(name, loader) {
    this._loaders[name] = loader;
  }

  loadAddons() {
    Object.keys(this._loaders)
      .map(name => this._loaders[name])
      .forEach(loader => loader(this._context));
  }
}

export default new AddonStore();
