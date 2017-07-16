export class AddonStore {
  constructor() {
    this.loaders = {};
    this.panels = {};
    this.channel = { on() {}, emit() {} };
    this.preview = null;
    this.database = null;
  }

  getChannel() {
    return this.channel;
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
    this.panels[name] = panel;
  }

  register(name, loader) {
    this.loaders[name] = loader;
  }

  loadAddons(api) {
    Object.keys(this.loaders).map(name => this.loaders[name]).forEach(loader => loader(api));
  }
}

export default new AddonStore();
