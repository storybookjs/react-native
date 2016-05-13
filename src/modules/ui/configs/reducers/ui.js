import { types } from '../../actions';

const defaultState = {
  showShortcutsHelp: false,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.SET_STORY_FILTER: {
      return {
        ...state,
        storyFilter: action.filter,
      };
    }

    case types.TOGGLE_SHORTCUTS_HELP: {
      return {
        ...state,
        showShortcutsHelp: !state.showShortcutsHelp,
      };
    }

    default:
      return state;
  }
}
