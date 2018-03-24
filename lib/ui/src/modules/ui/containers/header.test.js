import { headerMapper } from './header';

describe('manager.ui.containers.header', () => {
  describe('headerMapper', () => {
    test('should give correct data', () => {
      const uiOptions = {
        name: 'foo',
        url: 'bar',
      };
      const shortcutOptions = {
        showStoriesPanel: 'aa',
        showAddonPanel: 'bb',
        goFullScreen: 'cc',
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

      const result = headerMapper(state, props, env);

      expect(result.showStoriesPanel).toEqual('aa');
      expect(result.showAddonPanel).toEqual('bb');
      expect(result.goFullScreen).toEqual('cc');
      expect(result.addonPanelInRight).toEqual('lalala');
      expect(result.openShortcutsHelp).toBe(toggleShortcutsHelp);
    });
  });
});
