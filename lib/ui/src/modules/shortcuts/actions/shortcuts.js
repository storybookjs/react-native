import pick from 'lodash.pick';
import { features } from '../../../libs/key_events';
import apiActions from '../../api/actions';

const deprecationMessage = (oldName, newName) =>
  `The ${oldName} option has been renamed to ${
    newName
  } and will not be available in the next major Storybook release. Please update your config.`;

export function keyEventToOptions(currentOptions, event) {
  switch (event) {
    case features.FULLSCREEN:
      return { goFullScreen: !currentOptions.goFullScreen };
    case features.ADDON_PANEL:
      return { showAddonPanel: !currentOptions.showAddonPanel };
    case features.STORIES_PANEL:
      return { showStoriesPanel: !currentOptions.showStoriesPanel };
    case features.SHOW_SEARCH:
      return { showSearchBox: true };
    case features.ADDON_PANEL_IN_RIGHT:
      return { addonPanelInRight: !currentOptions.addonPanelInRight };
    default:
      return {};
  }
}

const renamedOptions = {
  showLeftPanel: 'showStoriesPanel',
  showDownPanel: 'showAddonPanel',
  downPanelInRight: 'addonPanelInRight',
};

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

      const withNewNames = Object.keys(renamedOptions).reduce((acc, oldName) => {
        const newName = renamedOptions[oldName];

        if (oldName in options && !(newName in options)) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(deprecationMessage(oldName, newName));
          }

          return {
            ...acc,
            [newName]: options[oldName],
          };
        }

        return acc;
      }, updatedOptions);

      return {
        shortcutOptions: withNewNames,
      };
    });
  },
};
