export default {
  setStoryFilter({ clientStore }, filter) {
    clientStore.set('storyFilter', filter);
  },

  toggleShortcutsHelp({ clientStore }) {
    clientStore.toggle('showShortcutsHelp');
  },

  selectAddonPanel({ clientStore }, panelName) {
    clientStore.set('selectedAddonPanel', panelName);
  },
};
