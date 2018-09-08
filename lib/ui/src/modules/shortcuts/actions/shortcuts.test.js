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
      actions.setOptions({ clientStore }, { goFullScreen: true });

      const stateUpdates = clientStore.updateCallback({});
      expect(stateUpdates.shortcutOptions).toMatchObject({ goFullScreen: true });
    });

    test('should only update options for the key already defined', () => {
      const clientStore = new MockClientStore();
      actions.setOptions({ clientStore }, { goFullScreen: true, random: 'value' });

      const stateUpdates = clientStore.updateCallback({});
      expect(stateUpdates.shortcutOptions).toMatchObject({ goFullScreen: true });
      expect(stateUpdates.shortcutOptions).not.toMatchObject({ random: 'value' });
    });

    test('should warn about deprecated option names', () => {
      const clientStore = new MockClientStore();
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      actions.setOptions(
        { clientStore },
        {
          showLeftPanel: 1,
          showDownPanel: 2,
          downPanelInRight: 3,
        }
      );

      const stateUpdates = clientStore.updateCallback({});
      expect(spy).toHaveBeenCalledTimes(3);
      expect(stateUpdates.shortcutOptions).toMatchObject({
        showStoriesPanel: 1,
        showAddonPanel: 2,
        addonPanelInRight: 3,
      });

      spy.mockReset();
      spy.mockRestore();
    });
  });
});
