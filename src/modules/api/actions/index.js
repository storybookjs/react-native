// define redux actions
export const types = {
  SELECT_STORY: 'API_SELECT_STORY',
  CLEAR_ACTIONS: 'API_CLEAR_ACTIONS',
  SET_STORIES: 'API_SET_STORIES',
  ADD_ACTION: 'API_ADD_ACTION',
};

import api from './api';

export default {
  api,
};
