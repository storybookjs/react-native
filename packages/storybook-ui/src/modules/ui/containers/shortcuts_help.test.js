import { mapper } from './shortcuts_help';

describe('manager.ui.containers.shortcuts_help', () => {
  describe('mapper', () => {
    test('should give correct data', () => {
      const toggleShortcutsHelp = () => null;
      const showShortcutsHelp = true;
      const props = {};
      const env = {
        actions: () => ({
          ui: {
            toggleShortcutsHelp,
          },
        }),
      };

      const state = {
        showShortcutsHelp,
      };
      const result = mapper(state, props, env);

      expect(result.isOpen).toBe(showShortcutsHelp);
      expect(result.onClose).toBe(toggleShortcutsHelp);
    });
  });
});
