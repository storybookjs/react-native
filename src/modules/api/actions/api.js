import pick from 'lodash.pick';
import { types } from './';
import { defaultState } from '../configs/reducers/api';

export default {
  setStories({ reduxStore, clientStore }, stories) {
    reduxStore.dispatch({
      type: types.SET_STORIES,
      stories,
    });

    clientStore.set('stories', stories);
  },

  selectStory({ reduxStore, clientStore }, kind, story) {
    reduxStore.dispatch({
      type: types.SELECT_STORY,
      kind,
      story,
    });

    clientStore.set('selectedKind', kind);
    clientStore.set('selectedStory', story);
  },

  jumpToStory({ reduxStore, clientStore }, direction) {
    reduxStore.dispatch({
      type: types.JUMP_TO_STORY,
      direction,
    });

    clientStore.update((state) => {
      return jumpToStory(state.stories, state.selectedKind, state.selectedStory, direction);
    });
  },

  setOptions({ reduxStore, clientStore }, options) {
    reduxStore.dispatch({
      type: types.SET_OPTIONS,
      options: pick(options, Object.keys(defaultState.options)),
    });

    clientStore.update((state) => {
      const newOptions = pick(options, Object.keys(state.options));
      const updatedOptions = {
        ...state.options,
        newOptions,
      };

      return { options: updatedOptions };
    });
  },

  setQueryParams({ reduxStore, clientStore }, customQueryParams) {
    reduxStore.dispatch({
      type: types.SET_QUERY_PARAMS,
      customQueryParams,
    });

    clientStore.update((state) => {
      const updatedQueryParams = {
        ...state.customQueryParams,
        customQueryParams,
      };

      Object.keys(customQueryParams).forEach(key => {
        if (updatedQueryParams[key] === null) {
          delete updatedQueryParams[key];
        }
      });

      return {
        customQueryParams: updatedQueryParams,
      };
    })
  },
};

export function jumpToStory(storyKinds, selectedKind, selectedStory, direction) {
  const flatteredStories = [];
  let currentIndex = -1;

  storyKinds.forEach(({ kind, stories }) => {
    stories.forEach((story) => {
      flatteredStories.push({ kind, story });
      if (kind === selectedKind && story === selectedStory) {
        currentIndex = flatteredStories.length - 1;
      }
    });
  });

  const jumpedStory = flatteredStories[currentIndex + direction];
  if (!jumpedStory) {
    return { selectedKind, selectedStory };
  }

  return {
    selectedKind: jumpedStory.kind,
    selectedStory: jumpedStory.story,
  };
}
