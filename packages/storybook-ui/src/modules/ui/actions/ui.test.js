import actions from './ui';

describe('manager.ui.actions.ui', () => {
  describe('setStoryFilter', () => {
    it('should set the given filter', () => {
      const clientStore = {
        set: jest.fn(),
      };
      const filter = 'kkkind';
      actions.setStoryFilter({ clientStore }, filter);

      expect(clientStore.set).toHaveBeenCalledWith('storyFilter', filter);
    });
  });

  describe('toggleShortcutsHelp', () => {
    it('should toggle the client sotre accordingly', () => {
      const clientStore = {
        toggle: jest.fn(),
      };
      actions.toggleShortcutsHelp({ clientStore });

      expect(clientStore.toggle).toHaveBeenCalledWith('showShortcutsHelp');
    });
  });

  describe('selectDownPanel', () => {
    it('should set the given panel name', () => {
      const clientStore = {
        set: jest.fn(),
      };
      const panelName = 'kkkind';
      actions.selectDownPanel({ clientStore }, panelName);

      expect(clientStore.set).toHaveBeenCalledWith('selectedDownPanel', panelName);
    });
  });
});
