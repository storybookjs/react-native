const { describe, it } = global;
import { expect } from 'chai';
import { mapper } from '../shortcuts_help';

describe('manager.ui.containers.shortcuts_help', () => {
  describe('mapper', () => {
    it('should give correct data', () => {
      const toggleShortcutsHelp = () => null;
      const showShortcutsHelp = true;

      const props = {};
      const env = {
        actions: () => ({
          ui: {
            toggleShortcutsHelp
          }
        })
      };

      const state = {
        showShortcutsHelp
      };

      const data = mapper(state, props, env);
      expect(data.isOpen).to.be.equal(showShortcutsHelp);
      expect(data.onClose).to.be.equal(toggleShortcutsHelp);
    });
  });
});
