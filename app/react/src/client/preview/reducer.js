import { types } from './actions';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case types.CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }

    case types.SET_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }

    case types.SELECT_STORY: {
      return {
        ...state,
        selectedKind: action.kind,
        selectedStory: action.story,
      };
    }

    case types.SET_INITIAL_STORY: {
      const newState = { ...state };
      const { storyKindList } = action;
      if (!newState.selectedKind && storyKindList.length > 0) {
        newState.selectedKind = storyKindList[0].kind;
        [newState.selectedStory] = storyKindList[0].stories;
      }
      return newState;
    }

    default:
      return state;
  }
}
