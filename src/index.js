export class AddonStore {
  constructor() {
    this._loaders = {};
    this._panels = {};
    this._store = {};
  }

  getPanels() {
    return this._panels;
  }

  setChannel(channel, name) {
    this._set('channel', channel, name);
  }

  getChannel() {
    return this._get('channel');
  }

  setDatabase(database, name) {
    this._set('database', database, name);
  }

  getDatabase() {
    return this._get('database');
  }

  setPreview(preview, name) {
    this._set('preview', preview, name);
  }

  getPreview() {
    return this._get('preview');
  }

  setPreviewDecorator(decorator, name) {
    this._set('preview decorator', decorator, name);
  }

  getPreviewDecorator() {
    return this._get('preview decorator');
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

  _set(key, value, name) {
    if (this._store[key]) {
      throw new Error(`There's ${key} called "${this._store[key].name}". You can only have a single ${key}.`);
    }

    this._store[key] = { value, name };
  }

  _get(key) {
    const item = this._store[key];
    if (!item) {
      return null;
    }

    return item.value;
  }
}

export default new AddonStore();
