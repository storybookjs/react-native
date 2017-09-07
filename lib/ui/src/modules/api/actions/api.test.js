import actions from './api';

class MockClientStore {
  update(cb) {
    this.updateCallback = cb;
  }
}

const stories = [
  { kind: 'abc', stories: ['a', 'b', 'c'] },
  { kind: 'bbc', stories: ['x', 'y', 'z'] },
];

describe('manager.api.actions.api', () => {
  describe('setStories', () => {
    describe('no selected story', () => {
      it('should set stories and select the first story', () => {
        const clientStore = new MockClientStore();
        actions.setStories({ clientStore }, stories);

        const newState = clientStore.updateCallback({});
        expect(newState).toEqual({
          stories,
          selectedKind: 'abc',
          selectedStory: 'a',
        });
      });
    });

    describe('has a selected story', () => {
      it('should set stories and select the existing story', () => {
        const clientStore = new MockClientStore();
        actions.setStories({ clientStore }, stories);

        const state = {
          selectedKind: 'abc',
          selectedStory: 'c',
        };
        const newState = clientStore.updateCallback(state);
        expect(newState).toEqual({
          stories,
          selectedKind: 'abc',
          selectedStory: 'c',
        });
      });
    });

    describe('has a selected story, but it is story is not in new stories', () => {
      it('should set stories and select the first story of the selected kind', () => {
        const clientStore = new MockClientStore();
        actions.setStories({ clientStore }, stories);

        const state = {
          selectedKind: 'bbc',
          selectedStory: 'k',
        };
        const newState = clientStore.updateCallback(state);
        expect(newState).toEqual({
          stories,
          selectedKind: 'bbc',
          selectedStory: 'x',
        });
      });
    });

    describe('has a selected story, but it is kind is not in new stories', () => {
      it('should set stories and select the first story', () => {
        const clientStore = new MockClientStore();
        actions.setStories({ clientStore }, stories);

        const state = {
          selectedKind: 'kky',
          selectedStory: 'c',
        };
        const newState = clientStore.updateCallback(state);
        expect(newState).toEqual({
          stories,
          selectedKind: 'abc',
          selectedStory: 'a',
        });
      });
    });
  });

  describe('selectStory', () => {
    describe('with both kind and story', () => {
      it('should select the correct story', () => {
        const clientStore = new MockClientStore();
        actions.selectStory({ clientStore }, 'bbc', 'y');

        const state = {
          stories,
          selectedKind: 'abc',
          selectedStory: 'c',
        };
        const stateUpdates = clientStore.updateCallback(state);
        expect(stateUpdates).toEqual({
          selectedKind: 'bbc',
          selectedStory: 'y',
        });
      });
    });

    describe('with just the kind', () => {
      it('should select the first of the kind', () => {
        const clientStore = new MockClientStore();
        actions.selectStory({ clientStore }, 'bbc');

        const state = {
          stories,
          selectedKind: 'abc',
          selectedStory: 'c',
        };
        const stateUpdates = clientStore.updateCallback(state);
        expect(stateUpdates).toEqual({
          selectedKind: 'bbc',
          selectedStory: 'x',
        });
      });
    });
  });

  describe('jumpToStory', () => {
    describe('has enough stories', () => {
      it('should select the next story', () => {
        const clientStore = new MockClientStore();
        actions.jumpToStory({ clientStore }, 1); // eslint-disable-line

        const state = {
          stories,
          selectedKind: 'abc',
          selectedStory: 'c',
        };
        const stateUpdates = clientStore.updateCallback(state);
        expect(stateUpdates).toEqual({
          selectedKind: 'bbc',
          selectedStory: 'x',
        });
      });

      it('should select the prev story', () => {
        const clientStore = new MockClientStore();
        actions.jumpToStory({ clientStore }, -1); // eslint-disable-line

        const state = {
          stories,
          selectedKind: 'abc',
          selectedStory: 'c',
        };
        const stateUpdates = clientStore.updateCallback(state);
        expect(stateUpdates).toEqual({
          selectedKind: 'abc',
          selectedStory: 'b',
        });
      });
    });

    describe('has not enough stories', () => {
      it('should select the current story', () => {
        const clientStore = new MockClientStore();
        actions.jumpToStory({ clientStore }, 1); // eslint-disable-line

        const state = {
          stories,
          selectedKind: 'bbc',
          selectedStory: 'z',
        };
        const stateUpdates = clientStore.updateCallback(state);
        expect(stateUpdates).toEqual({
          selectedKind: 'bbc',
          selectedStory: 'z',
        });
      });
    });
  });

  describe('setOptions', () => {
    it('should update options', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { abc: 10 });

      const state = {
        uiOptions: { bbc: 50, abc: 40 },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).toEqual({
        uiOptions: { bbc: 50, abc: 10 },
      });
    });

    const provider = {
      getPanels: () => ({
        'storybook/actions/actions-panel': {
          title: 'Action logger',
        },
        'storybooks/storybook-addon-knobs': {
          title: 'Knobs',
        },
      }),
    };

    it('should update selectedAddonPanel', () => {
      const clientStore = new MockClientStore();
      actions.setOptions(
        { clientStore, provider },
        { selectedAddonPanel: 'storybooks/storybook-addon-knobs' }
      );

      const state = {
        uiOptions: {},
        selectedAddonPanel: 'storybook/actions/actions-panel',
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates.selectedAddonPanel).toEqual('storybooks/storybook-addon-knobs');
    });

    it('should keep current addonPanel and output panel IDs', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore, provider }, { selectedAddonPanel: null });

      global.console = {
        log: jest.fn(),
        group: jest.fn(),
        groupEnd: jest.fn(),
      };
      const logger = console;

      const state = {
        uiOptions: {},
        selectedAddonPanel: 'storybook/actions/actions-panel',
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates.selectedAddonPanel).toEqual('storybook/actions/actions-panel');
      expect(logger.log.mock.calls).toEqual([
        ['storybook/actions/actions-panel (Action logger)'],
        ['storybooks/storybook-addon-knobs (Knobs)'],
      ]);
    });

    it('should only update options for the key already defined', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { abc: 10, notGoingToState: 20 });

      const state = {
        uiOptions: { bbc: 50, abc: 40 },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).toEqual({
        uiOptions: { bbc: 50, abc: 10 },
      });
    });
  });

  describe('setQueryParams', () => {
    it('shodul update query params', () => {
      const clientStore = new MockClientStore();
      actions.setQueryParams({ clientStore }, { abc: 'aaa', cnn: 'ccc' });

      const state = {
        customQueryParams: { bbc: 'bbb', abc: 'sshd' },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).toEqual({
        customQueryParams: { bbc: 'bbb', abc: 'aaa', cnn: 'ccc' },
      });
    });

    it('should delete the param if it is null', () => {
      const clientStore = new MockClientStore();
      actions.setQueryParams({ clientStore }, { abc: null, bbc: 'ccc' });

      const state = {
        customQueryParams: { bbc: 'bbb', abc: 'sshd' },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).toEqual({
        customQueryParams: { bbc: 'ccc' },
      });
    });
  });
});
