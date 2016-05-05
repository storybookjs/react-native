import { types } from '../../actions';
import { features } from '../../../../../libs/key_events';

const defaultState = {
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
};

export function keyEventToState(state, event) {
  switch (event) {
    case features.FULLSCREEN:
      return { goFullScreen: !state.goFullScreen };
    case features.DOWN_PANEL:
      return { showDownPanel: !state.showDownPanel };
    case features.LEFT_PANEL:
      return { showLeftPanel: !state.showLeftPanel };
    default:
      return {};
  }
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.HANDLE_EVENT: {
      return {
        ...state,
        ...keyEventToState(state, action.event),
      };
    }

    default:
      return state;
  }
}
