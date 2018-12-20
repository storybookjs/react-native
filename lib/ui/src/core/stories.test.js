import initStories from './stories';

describe('stories API', () => {
  it('sets a sensible initialState', () => {
    const { state } = initStories({
      componentId: 'id',
      viewMode: 'components',
    });

    expect(state).toEqual({
      storiesHash: {},
      componentId: 'id',
      viewMode: 'components',
    });
  });

  it('getUrl works', () => {
    throw new Error('NOT SURE IF THIS STILL NEEDS TO WORK');
  });

  // A reasonably complex hash of stories / components / groups
  const storiesHash = {
    a: { isComponent: true, children: ['a-1', 'a-2'] },
    'a-1': { path: 'a-1' },
    'a-2': { path: 'a-2' },
    b: { isComponent: false, children: ['b-c'] },
    'b-c': { isComponent: true, children: ['b-c-1'] },
    'b-c-1': { path: 'b-c-1' },
  };

  describe('jumpToStory', () => {
    it('works forward', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'a-1', viewMode: 'components' }),
      };

      const {
        api: { jumpToStory },
      } = initStories({ store, navigate });

      jumpToStory(1);
      expect(navigate).toHaveBeenCalledWith('/components/a-2');
    });

    it('works backwards', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'a-2', viewMode: 'components' }),
      };

      const {
        api: { jumpToStory },
      } = initStories({ store, navigate });

      jumpToStory(-1);
      expect(navigate).toHaveBeenCalledWith('/components/a-1');
    });

    it('does nothing if you are at the last story and go forward', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'b-c-1', viewMode: 'components' }),
      };

      const {
        api: { jumpToStory },
      } = initStories({ store, navigate });

      jumpToStory(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you are at the first story and go backward', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'a-1', viewMode: 'components' }),
      };

      const {
        api: { jumpToStory },
      } = initStories({ store, navigate });

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
      const store = {
        getState: () => ({ storiesHash, componentId: 'a-1', viewMode: 'components' }),
      };

      const {
        api: { jumpToComponent },
      } = initStories({ store, navigate });

      jumpToComponent(1);
      expect(navigate).toHaveBeenCalledWith('/components/b-c-1');
    });

    it('works backwards', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'b-c-1', viewMode: 'components' }),
      };

      const {
        api: { jumpToComponent },
      } = initStories({ store, navigate });

      jumpToComponent(-1);
      expect(navigate).toHaveBeenCalledWith('/components/a-1');
    });

    it('does nothing if you are in the last component and go forward', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'b-c-1', viewMode: 'components' }),
      };

      const {
        api: { jumpToComponent },
      } = initStories({ store, navigate });

      jumpToComponent(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you are at the first component and go backward', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ storiesHash, componentId: 'a-2', viewMode: 'components' }),
      };

      const {
        api: { jumpToComponent },
      } = initStories({ store, navigate });

      jumpToComponent(-1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you have not selected a story', () => {
      const navigate = jest.fn();
      const store = { getState: () => ({ storiesHash }) };

      const {
        api: { jumpToComponent },
      } = initStories({ store, navigate });

      jumpToComponent(1);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('setStories', () => {
    it('navigates to the first story in the store if there is none selected', () => {
      const navigate = jest.fn();
      const store = { getState: () => ({ viewMode: 'components' }), setState: jest.fn() };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).toHaveBeenCalledWith('/components/a-1');
    });

    it('navigates to the first story in the store if a non-existent story was selected', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'components', componentId: 'random' }),
        setState: jest.fn(),
      };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).toHaveBeenCalledWith('/components/a-1');
    });

    it('does not navigate if a existing story was selected', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'components', componentId: 'b-c-1' }),
        setState: jest.fn(),
      };

      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
