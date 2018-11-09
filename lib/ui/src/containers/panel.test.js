import { mapper } from './panel';

describe('manager.ui.containers.panel', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const state = {
        selectedPanel: 'sdp',
      };

      const setSelectPanel = () => 'setSelectPanel';
      const panels = {
        test1: {},
        test2: {},
        sdp: {},
      };
      const getElements = () => panels;

      const props = {};
      const env = {
        actions: () => ({
          ui: {
            setSelectPanel,
          },
        }),
        context: () => ({
          provider: {
            getElements,
          },
        }),
      };

      const result = mapper(state, props, env);

      expect(result.panels).toEqual(panels);
      expect(result.selectedPanel).toEqual('sdp');
      expect(result.onPanelSelect).toBe(setSelectPanel);
    });
  });
});
