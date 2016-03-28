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
        args[0].constructor &&
        /Synthetic/.test(args[0].constructor.name)
      ) {
        args[0] = `[${args[0].constructor.name}]`;
      }

      actions = [{ name, args }].concat(actions.slice(0, 4));
      syncedStore.setData({ actions });
    };
  }
}
