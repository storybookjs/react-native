import { types } from './';

export default {
  setStoryFilter({ reduxStore }, filter) {
    reduxStore.dispatch({
      type: types.SET_STORY_FILTER,
      filter,
    });
  },

  toggleShortcutsHelp({ reduxStore }) {
    reduxStore.dispatch({
      type: types.TOGGLE_SHORTCUTS_HELP,
    });
  },
};
