import { mapper } from './addon_panel';

describe('manager.ui.containers.addon_panel', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const state = {
        selectedAddonPanel: 'sdp',
      };

      const selectAddonPanel = () => 'selectAddonPanel';
      const panels = {
        test1: {},
        test2: {},
        sdp: {},
      };
      const getPanels = () => panels;

      const props = {};
      const env = {
        actions: () => ({
          ui: {
            selectAddonPanel,
          },
        }),
        context: () => ({
          provider: {
            getPanels,
          },
        }),
      };

      const result = mapper(state, props, env);

      expect(result.panels).toEqual(panels);
      expect(result.selectedPanel).toEqual('sdp');
      expect(result.onPanelSelect).toBe(selectAddonPanel);
    });
  });
});
