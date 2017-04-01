const { describe, it } = global;
import { expect } from 'chai';
import { mapper } from '../down_panel';

describe('manager.ui.containers.down_panel', () => {
  describe('mapper', () => {
    it('should give correct data', () => {
      const state = {
        selectedDownPanel: 'sdp'
      };

      const selectDownPanel = () => 'selectDownPanel';
      const panels = {
        test1: {},
        test2: {},
        sdp: {}
      };
      const getPanels = () => panels;

      const props = {};
      const env = {
        actions: () => ({
          ui: {
            selectDownPanel
          }
        }),
        context: () => ({
          provider: {
            getPanels
          }
        })
      };

      const data = mapper(state, props, env);
      expect(data.panels).to.deep.equal(panels);
      expect(data.selectedPanel).to.deep.equal('sdp');
      expect(data.onPanelSelect).to.equal(selectDownPanel);
    });
  });
});
