import { types } from './';

export default {
  setStories({ reduxStore }, stories) {
    reduxStore.dispatch({
      type: types.SET_STORIES,
      stories,
    });
  },

  selectStory({ reduxStore }, kind, story) {
    reduxStore.dispatch({
      type: types.SELECT_STORY,
      kind,
      story,
    });
  },

  clearActions({ reduxStore }) {
    reduxStore.dispatch({
      type: types.CLEAR_ACTIONS,
    });
  },

  addAction({ reduxStore }, action) {
    reduxStore.dispatch({
      type: types.ADD_ACTION,
      action,
    });
  },
};
