// define redux actions
export const types = {
  SET_STORIES: 'API_SET_STORIES',
  SELECT_STORY: 'API_SELECT_STORY',
  JUMP_TO_STORY: 'API_JUMP_TO_STORY',
  SET_OPTIONS: 'API_SET_OPTIONS',
};

import api from './api';

export default {
  api,
};
