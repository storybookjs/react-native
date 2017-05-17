import pick from 'lodash.pick';
import { features } from '../../../libs/key_events';
import apiActions from '../../api/actions';

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

export default {
  handleEvent(context, event) {
    const { clientStore } = context;
    switch (event) {
      case features.NEXT_STORY:
        apiActions.api.jumpToStory(context, 1);
        break;
      case features.PREV_STORY:
        apiActions.api.jumpToStory(context, -1);
        break;
      default:
        clientStore.update(state => {
          const newOptions = keyEventToOptions(state.shortcutOptions, event);
          const updatedOptions = {
            ...state.shortcutOptions,
            ...newOptions,
          };

          return {
            shortcutOptions: updatedOptions,
          };
        });
    }
  },

  setOptions({ clientStore }, options) {
    clientStore.update(state => {
      const updatedOptions = {
        ...state.shortcutOptions,
        ...pick(options, Object.keys(state.shortcutOptions)),
      };

      return {
        shortcutOptions: updatedOptions,
      };
    });
  },
};
