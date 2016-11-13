import pick from 'lodash.pick';
import { types } from './';
import { features } from '../../../libs/key_events';
import apiActions from '../../api/actions';
import { defaultState } from '../configs/reducers/shortcuts';

export default {
  handleEvent(context, event) {
    const { reduxStore, clientStore } = context;
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

        clientStore.update((state) => {
          const newOptions = keyEventToOptions(state.shortcutOptions, event);
          const updatedOptions = {
            ...state.shortcutOptions,
            ...newOptions,
          };

          return {
            shortcutOptions: updatedOptions
          };
        });
    }
  },

  setOptions({ reduxStore, clientStore }, options) {
    reduxStore.dispatch({
      type: types.SET_LAYOUT,
      layout: pick(options, Object.keys(defaultState)),
    });

    clientStore.update((state) => {
      const updatedOptions = {
        ...state.shortcutOptions,
        ...pick(options, Object.keys(state.shortcutOptions))
      };

      return {
        shortcutOptions: updatedOptions,
      };
    });
  },
};

export function keyEventToOptions(currentOptions, event) {
  switch (event) {
    case features.FULLSCREEN:
      return { goFullScreen: !currentOptions.goFullScreen };
    case features.DOWN_PANEL:
      return { showDownPanel: !currentOptions.showDownPanel };
    case features.LEFT_PANEL:
      return { showLeftPanel: !currentOptions.showLeftPanel };
    case features.SEARCH:
      return { showSearchBox: !currentOptions.showSearchBox };
    case features.DOWN_PANEL_IN_RIGHT:
      return { downPanelInRight: !currentOptions.downPanelInRight };
    default:
      return {};
  }
}
