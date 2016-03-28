export default class ClientApi {
  constructor({ syncedStore, storyStore }) {
    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  storiesOf(kind, m) {
    m.hot.dispose(() => {
      this._storyStore.removeStoryKind(kind);
    });

    const add = (storyName, fn) => {
      this._storyStore.addStory(kind, storyName, fn);
      return { add };
    };

    return { add };
  }

  action(name) {
    const syncedStore = this._syncedStore;

    return function (...args) {
      const newArgs = { ...args };
      let { actions = [] } = syncedStore.getData();

      // Remove events from the args. Otherwise, it creates a huge JSON string.
      if (
        newArgs[0] &&
        newArgs[0].constructor &&
        /Synthetic/.test(newArgs[0].constructor.name)
      ) {
        newArgs[0] = `[${newArgs[0].constructor.name}]`;
      }

      actions = [{ name, newArgs }].concat(actions.slice(0, 5));
      syncedStore.setData({ actions });
    };
  }
}
