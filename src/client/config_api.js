export default class ConfigApi {
  constructor({ syncedStore, storyStore }) {
    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  _renderMain() {
    const data = this._syncedStore.getData();
    data.error = null;
    data.__updatedAt = Date.now();
    data.storyStore = this._storyStore.dumpStoryBook();

    if (!this._storyStore.hasStoryKind(data.selectedKind)) {
      data.selectedKind = this._storyStore.getStoryKinds()[0];
    }

    if (this._storyStore.hasStoryKind(data.selectedKind)) {
      if (!this._storyStore.hasStory(data.selectedKind, data.selectedStory)) {
        data.selectedStory = this._storyStore.getStories(data.selectedKind, data.selectedStory)[0];
      }
    }

    this._syncedStore.setData(data);
  }

  _renderError(e) {
    const data = this._syncedStore.getData();
    const { stack, message } = e;
    data.error = { stack, message };

    this._syncedStore.setData(data);
  }

  configure(loaders, module) {
    const render = () => {
      try {
        loaders();
        this._renderMain();
      } catch (error) {
        this._renderError(error);
      }
    };

    if (module.hot) {
      module.hot.accept(() => {
        setTimeout(render);
      });
    }

    render();
  }
}
