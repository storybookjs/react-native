import initStories from '../modules/stories';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
    }),
  };
}

describe('stories API', () => {
  it('sets a sensible initialState', () => {
    const { state } = initStories({
      storyId: 'id',
      viewMode: 'story',
    });

    expect(state).toEqual({
      storiesConfigured: false,
      storiesHash: {},
      storyId: 'id',
      viewMode: 'story',
    });
  });
  const parameters = { options: { hierarchyRootSeparator: '|', hierarchySeparator: '/' } };
  const storiesHash = {
    'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1' },
    'a--2': { kind: 'a', name: '2', parameters, path: 'a--2', id: 'a--2' },
    'b-c--1': {
      kind: 'b/c',
      name: '1',
      parameters,
      path: 'b-c--1',
      id: 'b-c--1',
    },
  };
  describe('setStories', () => {
    it('stores basic kinds and stories w/ correct keys', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);

      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual(['a', 'a--1', 'a--2', 'b', 'b-c', 'b-c--1']);
      expect(storedStoriesHash.a).toMatchObject({
        id: 'a',
        children: ['a--1', 'a--2'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['a--1']).toMatchObject({
        id: 'a--1',
        parent: 'a',
        kind: 'a',
        name: '1',
        parameters,
      });

      expect(storedStoriesHash['a--2']).toMatchObject({
        id: 'a--2',
        parent: 'a',
        kind: 'a',
        name: '2',
        parameters,
      });

      expect(storedStoriesHash.b).toMatchObject({
        id: 'b',
        children: ['b-c'],
        isRoot: false,
        isComponent: false,
      });

      expect(storedStoriesHash['b-c']).toMatchObject({
        id: 'b-c',
        parent: 'b',
        children: ['b-c--1'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['b-c--1']).toMatchObject({
        id: 'b-c--1',
        parent: 'b-c',
        kind: 'b/c',
        name: '1',
        parameters,
      });
    });

    it('handles roots also', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1' },
        'a--2': { kind: 'a', name: '2', parameters, path: 'a--2', id: 'a--2' },
        'b-c--1': {
          kind: 'b|c',
          name: '1',
          parameters,
          path: 'b-c--1',
          id: 'b-c--1',
        },
      });
      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual(['a', 'a--1', 'a--2', 'b', 'b-c', 'b-c--1']);
      expect(storedStoriesHash.b).toMatchObject({
        id: 'b',
        children: ['b-c'],
        isRoot: true,
        isComponent: false,
      });

      expect(storedStoriesHash['b-c']).toMatchObject({
        id: 'b-c',
        parent: 'b',
        children: ['b-c--1'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['b-c--1']).toMatchObject({
        id: 'b-c--1',
        parent: 'b-c',
        kind: 'b|c',
        name: '1',
        parameters,
      });
    });

    // Stories can get out of order for a few reasons -- see reproductions on
    //   https://github.com/storybookjs/storybook/issues/5518
    it('does the right thing for out of order stories', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1' },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1' },
        'a--2': { kind: 'a', name: '2', parameters, path: 'a--2', id: 'a--2' },
      });

      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual(['a', 'a--1', 'a--2', 'b', 'b--1']);
      expect(storedStoriesHash.a).toMatchObject({
        id: 'a',
        children: ['a--1', 'a--2'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash.b).toMatchObject({
        id: 'b',
        children: ['b--1'],
        isRoot: false,
        isComponent: true,
      });
    });

    it('navigates to the first story in the store if there is none selected', () => {
      const navigate = jest.fn();
      const store = { getState: () => ({ viewMode: 'story' }), setState: jest.fn() };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('navigates to the first story in the store if a non-existent story was selected', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storyId: 'random' }),
        setState: jest.fn(),
      };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('does not navigate if a existing story was selected', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storyId: 'b-c--1' }),
        setState: jest.fn(),
      };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('navigates to the settings page if a existing page was selected', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'settings', storyId: 'about' }),
        setState: jest.fn(),
      };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).toHaveBeenCalledWith('/settings/about');
    });

    it(
      'navigates to the first story in the store when viewMode is settings but' +
        'non-existent page was selected',
      () => {
        const navigate = jest.fn();
        const store = {
          getState: () => ({ viewMode: 'settings', storyId: 'random' }),
          setState: jest.fn(),
        };

        const {
          api: { setStories },
        } = initStories({ store, navigate });

        setStories(storiesHash);
        expect(navigate).toHaveBeenCalledWith('/story/a--1');
      }
    );
  });

  describe('jumpToStory', () => {
    it('works forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'a--1', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(1);
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('works backwards', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'a--2', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(-1);
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('does nothing if you are at the last story and go forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'b-c--1', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you are at the first story and go backward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'a--1', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(-1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you have not selected a story', () => {
      const navigate = jest.fn();
      const store = { getState: () => ({ storiesHash }) };

      const {
        api: { jumpToStory },
      } = initStories({ store, navigate });

      jumpToStory(1);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('jumpToComponent', () => {
    it('works forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'a--1', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(1);
      expect(navigate).toHaveBeenCalledWith('/story/b-c--1');
    });

    it('works backwards', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'b-c--1', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(-1);
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('does nothing if you are in the last component and go forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'b-c--1', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you are at the first component and go backward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'a--2', viewMode: 'story' });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(-1);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('selectStory', () => {
    it('navigates', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate });

      selectStory('a--2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating to kind/storyname (legacy api)', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate });

      selectStory('a', '2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating to storyname, without kind (legacy api)', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storyId: 'a--1', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate });

      selectStory(null, '2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating to first story in kind on call by kind', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { selectStory, setStories },
        state,
      } = initStories({ store, navigate });
      store.setState(state);
      setStories(storiesHash);

      selectStory('a');
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });
  });
});
