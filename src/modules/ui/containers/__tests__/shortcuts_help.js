const { describe, it } = global;
import { expect } from 'chai';
import { composer } from '../shortcuts_help';

describe('manager.ui.containers.shortcuts_help', () => {
  describe('composer', () => {
    it('should give correct data', () => {
      const toggleShortcutsHelp = () => null;
      const showShortcutsHelp = true;

      const props = {
        actions: () => ({
          ui: {
            toggleShortcutsHelp,
          },
        }),
      };

      const state = {
        ui: {
          showShortcutsHelp,
        },
      };

      const data = composer(state, props);
      expect(data.isOpen).to.be.equal(showShortcutsHelp);
      expect(data.onClose).to.be.equal(toggleShortcutsHelp);
    });
  });
});
