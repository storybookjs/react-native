export default {
  setStoryFilter({ clientStore }, filter) {
    clientStore.set('storyFilter', filter);
  },

  toggleShortcutsHelp({ clientStore }) {
    clientStore.toggle('showShortcutsHelp');
  },

  selectDownPanel({ clientStore }, panelName) {
    clientStore.set('selectedDownPanel', panelName);
  },
};
