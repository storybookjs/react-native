export class AddonStore {
  constructor() {
    this.loaders = {};
    this.panels = {};
    this.channel = null;
    this.preview = null;
    this.database = null;
  }

  getChannel() {
    // this.channel should get overwritten by setChannel if package versions are
    // correct and AddonStore is a proper singleton. If not, throw.
    if (!this.channel) {
      throw new Error(
        'Accessing nonexistent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel'
      );
    }
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
