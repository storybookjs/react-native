import actions from './shortcuts';

class MockClientStore {
  update(cb) {
    this.updateCallback = cb;
  }
}

describe('manager.shortcuts.actions.shortcuts', () => {
  describe('setOptions', () => {
    test('should update options', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { abc: 10 });

      const state = {
        shortcutOptions: { bbc: 50, abc: 40 },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).toEqual({
        shortcutOptions: { bbc: 50, abc: 10 },
      });
    });

    test('should only update options for the key already defined', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { abc: 10, kki: 50 });

      const state = {
        shortcutOptions: { bbc: 50, abc: 40 },
      };

      const stateUpdates = clientStore.updateCallback(state);
      expect(stateUpdates).toEqual({
        shortcutOptions: { bbc: 50, abc: 10 },
      });
    });

    test('should warn about deprecated option names', () => {
      const clientStore = new MockClientStore();
      const spy = jest.spyOn(console, 'warn');
      actions.setOptions(
        { clientStore },
        {
          showLeftPanel: 1,
          showDownPanel: 2,
          downPanelInRight: 3,
        }
      );

      const state = {
        shortcutOptions: {},
      };
      const stateUpdates = clientStore.updateCallback(state);
      expect(spy).toHaveBeenCalledTimes(3);
      expect(stateUpdates).toEqual({
        shortcutOptions: {
          showStoriesPanel: 1,
          showAddonPanel: 2,
          addonPanelInRight: 3,
        },
      });

      spy.mockReset();
      spy.mockRestore();
    });
  });
});
