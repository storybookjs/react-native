export default class ClientApi {
  constructor({ syncedStore, storyStore }) {
    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  storiesOf(kind, m) {
    if (m && m.hot) {
      m.hot.dispose(() => {
        this._storyStore.removeStoryKind(kind);
      });
    }

    const add = (storyName, fn) => {
      this._storyStore.addStory(kind, storyName, fn);
      return { add };
    };

    return { add };
  }

  action(name) {
    const syncedStore = this._syncedStore;

    return function (..._args) {
      const args = Array.from(_args);
      let { actions = [] } = syncedStore.getData();

      // Remove events from the args. Otherwise, it creates a huge JSON string.
      if (
        args[0] &&
        typeof args[0].preventDefault === 'function'
      ) {
        args[0] = '[SyntheticEvent]';
      }

      actions = [{ name, args }].concat(actions.slice(0, 4));
      syncedStore.setData({ actions });
    };
  }

  linkTo(kind, story) {
    const syncedStore = this._syncedStore;

    return function (...args) {
      const resolvedKind = typeof kind === 'function' ? kind(...args) : kind;

      let resolvedStory;
      if (story) {
        resolvedStory = typeof story === 'function' ? story(...args) : story;
      } else {
        const { storyStore } = syncedStore.getData();

        resolvedStory = storyStore
          .find(item => item.kind === kind)
          .stories[0];
      }

      syncedStore.setData({
        selectedKind: resolvedKind,
        selectedStory: resolvedStory,
      });
    };
  }
}
