let actionIds = 0;

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

    const decorators = [];
    const api = {};

    api.add = (storyName, getStory) => {
      // Wrap the getStory function with each decorator. The first
      // decorator will wrap the story function. The second will
      // wrap the first decorator and so on.
      const fn = decorators.reduce((decorated, decorator) => {
        return () => decorator(decorated);
      }, getStory);

      // Add the fully decorated getStory function.
      this._storyStore.addStory(kind, storyName, fn);
      return api;
    };

    api.addDecorator = decorator => {
      decorators.push(decorator);
      return api;
    };

    return api;
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

      const id = actionIds++;
      actions = [{ id, name, args }].concat(actions.slice(0, 4));
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
