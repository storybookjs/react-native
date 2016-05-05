import UUID from 'uuid';

export default class ClientApi {
  constructor({ pageBus, storyStore }) {
    this._pageBus = pageBus;
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
    const pageBus = this._pageBus;

    return function (..._args) {
      let args = Array.from(_args);

      // Remove events from the args. Otherwise, it creates a huge JSON string.
      args = args.map(arg => {
        if (arg && typeof arg.preventDefault === 'function') {
          return '[SyntheticEvent]';
        }
        return arg;
      });

      const id = UUID.v4();
      const data = { name, args };
      const action = { data, id };

      pageBus.emit('addAction', { action });
    };
  }

  linkTo(kind, story) {
    const pageBus = this._pageBus;

    return function (...args) {
      const resolvedKind = typeof kind === 'function' ? kind(...args) : kind;
      const resolvedStory = typeof story === 'function' ? story(...args) : story;

      pageBus.emit('selectStory', { kind: resolvedKind, story: resolvedStory });
    };
  }
}
