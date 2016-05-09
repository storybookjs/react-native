// define redux actions
export const types = {
  SET_STORIES: 'API_SET_STORIES',
  SELECT_STORY: 'API_SELECT_STORY',
  JUMP_TO_STORY: 'API_JUMP_TO_STORY',
  CLEAR_ACTIONS: 'API_CLEAR_ACTIONS',
  ADD_ACTION: 'API_ADD_ACTION',
};

import api from './api';

export default {
  api,
};
