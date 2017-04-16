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
  });
});
