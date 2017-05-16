import { mapper } from './down_panel';

describe('manager.ui.containers.down_panel', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const state = {
        selectedDownPanel: 'sdp',
      };

      const selectDownPanel = () => 'selectDownPanel';
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
            selectDownPanel,
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
      expect(result.onPanelSelect).toBe(selectDownPanel);
    });
  });
});
