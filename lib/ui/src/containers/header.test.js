import { mapper } from './header';

describe('manager.ui.containers.header', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const uiOptions = {
        name: 'foo',
        url: 'bar',
      };
      const shortcutOptions = {
        showStoriesPanel: 'aa',
        enableShortcuts: true,
        addonPanelInRight: true,
      };
      const toggleShortcutsHelp = () => 'toggleShortcutsHelp';
      const props = {};
      const env = {
        actions: () => ({
          ui: {
            toggleShortcutsHelp,
          },
        }),
      };
      const state = {
        uiOptions,
        shortcutOptions,
      };

      const result = mapper(state, props, env);

      expect(result.openShortcutsHelp).toBe(toggleShortcutsHelp);
      expect(result.enableShortcutsHelp).toEqual(shortcutOptions.enableShortcuts);
      expect(result.addonPanelInRight).toEqual(true);

      const stateWhenMobileDevice = {
        uiOptions,
        shortcutOptions,
        isMobileDevice: true,
      };

      const resultWhenMobileDevice = mapper(stateWhenMobileDevice, props, env);
      expect(resultWhenMobileDevice.addonPanelInRight).toEqual(false);
    });
  });
});
