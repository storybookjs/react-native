import { types } from './';
import { features } from '../../../../libs/key_events';
import apiActions from '../../api/actions';

export default {
  handleEvent(context, event) {
    const { reduxStore } = context;
    switch (event) {
      case features.NEXT_STORY:
        apiActions.api.jumpToStory(context, 1);
        break;
      case features.PREV_STORY:
        apiActions.api.jumpToStory(context, -1);
        break;
      default:
        reduxStore.dispatch({
          type: types.HANDLE_EVENT,
          event,
        });
    }
  },
};
