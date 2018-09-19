import { mapper } from './panel';

describe('manager.ui.containers.panel', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const state = {
        selectedPanel: 'sdp',
      };

      const selectPanel = () => 'selectPanel';
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
            selectPanel,
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
      expect(result.onPanelSelect).toBe(selectPanel);
    });
  });
});
