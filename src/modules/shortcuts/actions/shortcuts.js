import { types } from './';

export default {
  handleEvent({ reduxStore }, event) {
    reduxStore.dispatch({
      type: types.HANDLE_EVENT,
      event,
    });
  },
};
