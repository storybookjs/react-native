export const types = {
  SET_ERROR: 'PREVIEW_SET_ERROR',
  CLEAR_ERROR: 'PREVIEW_CLEAR_ERROR',
  SELECT_STORY: 'PREVIEW_SELECT_STORY',
  SET_INITIAL_STORY: 'PREVIEW_SET_INITIAL_STORY',
};

export function setInitialStory(storyKindList) {
  return {
    type: types.SET_INITIAL_STORY,
    storyKindList,
  };
}

export function setError(error) {
  return {
    type: types.SET_ERROR,
    error,
  };
}

export function clearError() {
  return {
    type: types.CLEAR_ERROR,
  };
}

export function selectStory(kind, story) {
  return {
    type: types.SELECT_STORY,
    kind,
    story,
  };
}
