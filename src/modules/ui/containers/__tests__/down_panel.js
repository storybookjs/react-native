const { describe, it } = global;
import { expect } from 'chai';
import { composer } from '../down_panel';

describe('manager.ui.containers.down_panel', () => {
  describe('composer', () => {
    it('should give correct data', () => {
      const state = {
        ui: {
          selectedDownPanel: 'sdp',
        },
      };

      const selectDownPanel = () => 'selectDownPanel';
      const panels = {
        test1: {},
        test2: {},
        sdp: {},
      };
      const getPanels = () => panels;

      const props = {
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

      const data = composer(state, props);
      expect(data.panels).to.deep.equal(panels);
      expect(data.selectedPanel).to.deep.equal('sdp');
      expect(data.onPanelSelect).to.equal(selectDownPanel);
    });
  });
});
