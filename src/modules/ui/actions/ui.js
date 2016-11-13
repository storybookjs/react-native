import { types } from './';

export default {
  setStoryFilter({ reduxStore, clientStore }, filter) {
    reduxStore.dispatch({
      type: types.SET_STORY_FILTER,
      filter,
    });
    clientStore.set('storyFilter', filter);
  },

  toggleShortcutsHelp({ reduxStore, clientStore }) {
    reduxStore.dispatch({
      type: types.TOGGLE_SHORTCUTS_HELP,
    });
    clientStore.toggle('showShortcutsHelp');
  },

  selectDownPanel({ reduxStore, clientStore }, panelName) {
    reduxStore.dispatch({
      type: types.SELECT_BOTTOM_PANEL,
      panelName,
    });
    clientStore.set('selectedBottomPanel', panelName);
  },
};
