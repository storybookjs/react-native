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

  jumpToStory({ reduxStore }, direction) {
    reduxStore.dispatch({
      type: types.JUMP_TO_STORY,
      direction,
    });
  },

  setOptions({ reduxStore }, options) {
    reduxStore.dispatch({
      type: types.SET_OPTIONS,
      options,
    });
  },
};
